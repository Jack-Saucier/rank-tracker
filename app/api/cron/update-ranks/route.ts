import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const PLATFORM_MAP: Record<string, string> = {
  steam: 'steam',
  epic: 'epic',
  psn: 'psn',
  xbox: 'xbl',
};

const PLAYLIST_MAP: Record<string, 'duel' | 'doubles' | 'standard'> = {
  'Ranked Duel 1v1': 'duel',
  'Ranked Doubles 2v2': 'doubles',
  'Ranked Standard 3v3': 'standard',
};

export async function GET(request: Request) {
  // Protect this endpoint so only Vercel's cron scheduler (or you, manually) can trigger it
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: accounts, error } = await supabase
    .from('game_accounts')
    .select('id, platform, platform_username');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];

  for (const account of accounts ?? []) {
    const apiPlatform = PLATFORM_MAP[account.platform];
    if (!apiPlatform) {
      results.push({ account: account.id, status: 'skipped', reason: 'unknown platform' });
      continue;
    }

    try {
      const res = await fetch(
        `https://rocket-league10.p.rapidapi.com/stats/${apiPlatform}/${encodeURIComponent(account.platform_username)}`,
        {
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
            'x-rapidapi-host': 'rocket-league10.p.rapidapi.com',
            'x-rapidapi-ua': 'RapidAPI-Playground',
          },
        }
      );

      if (!res.ok) {
        results.push({ account: account.id, status: 'error', reason: `HTTP ${res.status}` });
        continue;
      }

      const data = await res.json();

      if (!data.ranked || !Array.isArray(data.ranked)) {
        results.push({ account: account.id, status: 'error', reason: 'no ranked data' });
        continue;
      }

      const snapshotsToInsert = data.ranked
        .filter((entry: any) => PLAYLIST_MAP[entry.playlistName])
        .map((entry: any) => ({
          game_account_id: account.id,
          playlist: PLAYLIST_MAP[entry.playlistName],
          rank_tier: `${entry.tier} ${entry.division}`,
          mmr: entry.rating,
        }));

      if (snapshotsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('rank_snapshots')
          .insert(snapshotsToInsert);

        if (insertError) {
          results.push({ account: account.id, status: 'error', reason: insertError.message });
          continue;
        }
      }

      results.push({ account: account.id, status: 'success', playlists: snapshotsToInsert.length });
    } catch (err: any) {
      results.push({ account: account.id, status: 'error', reason: err.message });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}