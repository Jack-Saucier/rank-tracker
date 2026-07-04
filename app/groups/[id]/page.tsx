import { createClient } from '@/lib/supabase/server';

const PLAYLIST_LABELS: Record<string, string> = {
  duel: '1v1 Duel',
  doubles: '2v2 Doubles',
  standard: '3v3 Standard',
};

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Get group info
  const { data: group } = await supabase
    .from('groups')
    .select('id, name, invite_code')
    .eq('id', id)
    .single();

  if (!group) {
    return <main><p>Group not found.</p></main>;
  }

  // Get members of this group, joined with their profile info
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id, users(username, avatar_url)')
    .eq('group_id', id);

  if (!members || members.length === 0) {
    return (
      <main>
        <h1>{group.name}</h1>
        <p>No members yet.</p>
      </main>
    );
  }

  const userIds = members.map((m: any) => m.user_id);

  // Get all game accounts belonging to these members
  const { data: accounts } = await supabase
    .from('game_accounts')
    .select('id, user_id, platform_username')
    .in('user_id', userIds);

  const accountIds = accounts?.map((a) => a.id) ?? [];

  // Get the latest rank snapshot per account per playlist
  const { data: snapshots } = accountIds.length
    ? await supabase
        .from('rank_snapshots')
        .select('game_account_id, playlist, rank_tier, mmr, captured_at')
        .in('game_account_id', accountIds)
        .order('captured_at', { ascending: false })
    : { data: [] };

  // Build a lookup: for each account+playlist, keep only the most recent snapshot
  const latestByAccountPlaylist = new Map<string, any>();
  snapshots?.forEach((s) => {
    const key = `${s.game_account_id}-${s.playlist}`;
    if (!latestByAccountPlaylist.has(key)) {
      latestByAccountPlaylist.set(key, s);
    }
  });

  return (
    <main>
      <h1>{group.name}</h1>
      <p>Invite code: {group.invite_code}</p>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Account</th>
            <th>1v1 Duel</th>
            <th>2v2 Doubles</th>
            <th>3v3 Standard</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m: any) => {
            const memberAccounts = accounts?.filter((a) => a.user_id === m.user_id) ?? [];

            if (memberAccounts.length === 0) {
              return (
                <tr key={m.user_id}>
                  <td>{m.users?.username ?? 'Unknown'}</td>
                  <td colSpan={4}>No linked game account</td>
                </tr>
              );
            }

            return memberAccounts.map((acc) => (
              <tr key={acc.id}>
                <td>{m.users?.username ?? 'Unknown'}</td>
                <td>{acc.platform_username}</td>
                {['duel', 'doubles', 'standard'].map((playlist) => {
                  const snap = latestByAccountPlaylist.get(`${acc.id}-${playlist}`);
                  return (
                    <td key={playlist}>
                      {snap ? snap.rank_tier : '—'}
                    </td>
                  );
                })}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </main>
  );
}