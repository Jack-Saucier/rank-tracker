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

async function fetchFortniteWins(displayName: string): Promise<number | null> {
  const accountRes = await fetch(
    `https://prod.api-fortnite.com/api/v1/account/displayName/${encodeURIComponent(displayName)}`,
    { headers: { 'x-api-key': process.env.FORTNITE_API_KEY! } }
  );
  if (!accountRes.ok) return null;
  const accountData = await accountRes.json();

  const statsRes = await fetch(
    `https://prod.api-fortnite.com/api/v2/stats/${accountData.id}`,
    { headers: { 'x-api-key': process.env.FORTNITE_API_KEY! } }
  );
  if (!statsRes.ok) return null;
  const statsData = await statsRes.json();

  const stats = statsData.stats ?? {};
  let totalWins = 0;
  for (const key in stats) {
    if (key.includes('placetop1')) {
      totalWins += stats[key];
    }
  }
  return totalWins;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const results = [];

  // --- Rocket League ---
  const { data: accounts, error } = await supabase
    .from('game_accounts')
    .select('id, platform, platform_username')
    .eq('game', 'rocket_league');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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

  // --- Fortnite ---
  const { data: fortniteAccounts } = await supabase
    .from('game_accounts')
    .select('id, platform_username')
    .eq('game', 'fortnite');

  for (const account of fortniteAccounts ?? []) {
    try {
      const wins = await fetchFortniteWins(account.platform_username);

      if (wins === null) {
        results.push({ account: account.id, status: 'error', reason: 'lookup failed' });
        continue;
      }

      const { error: insertError } = await supabase
        .from('rank_snapshots')
        .insert({
          game_account_id: account.id,
          playlist: 'battle_royale',
          rank_tier: `${wins} wins`,
          mmr: wins,
        });

      if (insertError) {
        results.push({ account: account.id, status: 'error', reason: insertError.message });
        continue;
      }

      results.push({ account: account.id, status: 'success', wins });
    } catch (err: any) {
      results.push({ account: account.id, status: 'error', reason: err.message });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}