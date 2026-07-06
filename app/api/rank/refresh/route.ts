import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchSnapshotsForAccount } from '@/lib/rankFetchers';

export async function POST(request: Request) {
  const { accountId } = await request.json();
  if (!accountId) {
    return NextResponse.json({ error: 'Missing accountId' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: account, error } = await admin
    .from('game_accounts')
    .select('id, user_id, game, platform, platform_username')
    .eq('id', accountId)
    .single();

  if (error || !account || account.user_id !== user.id) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const snapshots = await fetchSnapshotsForAccount(account.game, account.platform, account.platform_username);

  if (!snapshots || snapshots.length === 0) {
    return NextResponse.json({ status: 'no_data' });
  }

  const { error: insertError } = await admin
    .from('rank_snapshots')
    .insert(snapshots.map((s) => ({ game_account_id: account.id, ...s })));

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'success', count: snapshots.length });
}