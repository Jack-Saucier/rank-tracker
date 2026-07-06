import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchSnapshotsForAccount } from '@/lib/rankFetchers';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: accounts, error } = await supabase
    .from('game_accounts')
    .select('id, game, platform, platform_username');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];

  for (const account of accounts ?? []) {
    try {
      const snapshots = await fetchSnapshotsForAccount(account.game, account.platform, account.platform_username);

      if (!snapshots) {
        results.push({ account: account.id, status: 'error', reason: 'lookup failed' });
        continue;
      }

      if (snapshots.length > 0) {
        const { error: insertError } = await supabase
          .from('rank_snapshots')
          .insert(snapshots.map((s) => ({ game_account_id: account.id, ...s })));

        if (insertError) {
          results.push({ account: account.id, status: 'error', reason: insertError.message });
          continue;
        }
      }

      results.push({ account: account.id, status: 'success', count: snapshots.length });
    } catch (err: any) {
      results.push({ account: account.id, status: 'error', reason: err.message });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}