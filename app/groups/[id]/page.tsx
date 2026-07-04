import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import GroupLeaderboard from '@/components/GroupLeaderboard';

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: group } = await supabase
    .from('groups')
    .select('id, name, invite_code')
    .eq('id', id)
    .single();

  if (!group) {
    return <main><p>Group not found.</p></main>;
  }

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

  const { data: accounts } = await supabase
    .from('game_accounts')
    .select('id, user_id, game, platform, platform_username')
    .in('user_id', userIds);

  const accountIds = accounts?.map((a) => a.id) ?? [];

  const { data: snapshots } = accountIds.length
    ? await supabase
        .from('rank_snapshots')
        .select('game_account_id, playlist, rank_tier, mmr, captured_at')
        .in('game_account_id', accountIds)
        .order('captured_at', { ascending: false })
    : { data: [] };

  const latestByAccountPlaylist = new Map<string, any>();
  snapshots?.forEach((s) => {
    const key = `${s.game_account_id}-${s.playlist}`;
    if (!latestByAccountPlaylist.has(key)) {
      latestByAccountPlaylist.set(key, s);
    }
  });

  const usernameByUserId = new Map<string, string>();
  members.forEach((m: any) => usernameByUserId.set(m.user_id, m.users?.username ?? 'Unknown'));

  const rows = (accounts ?? []).flatMap((acc) => {
    const playlists = ['duel', 'doubles', 'standard', 'ranked', 'battle_royale', 'tank', 'damage', 'support'];
    return playlists.map((playlist) => {
      const snap = latestByAccountPlaylist.get(`${acc.id}-${playlist}`);
      return {
        accountId: acc.id,
        username: usernameByUserId.get(acc.user_id) ?? 'Unknown',
        platformUsername: acc.platform_username,
        game: acc.game,
        playlist,
        rankTier: snap?.rank_tier ?? null,
        mmr: snap?.mmr ?? null,
      };
    });
  });

  return (
    <main>
      <Link href="/groups" style={{ fontSize: '14px' }}>← back to groups</Link>
      <h1 style={{ fontSize: '36px', margin: '16px 0 4px' }}>{group.name}</h1>
      <span className="invite-chip">invite code: {group.invite_code}</span>

      <div style={{ marginTop: '32px' }}>
        <GroupLeaderboard rows={rows} />
      </div>
    </main>
  );
}