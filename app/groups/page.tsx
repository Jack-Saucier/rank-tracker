import LinkAccountForm from '@/components/LinkAccountForm';
import { createClient } from '@/lib/supabase/server';
import CreateGroupForm from '@/components/CreateGroupForm';
import JoinGroupForm from '@/components/JoinGroupForm';
import Link from 'next/link';

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <main><p>Please sign in to view your groups.</p></main>;
  }

  const { data: memberships } = await supabase
    .from('group_members')
    .select('groups(id, name, invite_code)')
    .eq('user_id', user.id);

  return (
    <main>
      <h1>Your Groups</h1>
      <h2>Link a Game Account</h2>
      <LinkAccountForm userId={user.id} />

      <ul>
        {memberships?.map((m: any) => (
          <li key={m.groups.id}>
            <Link href={`/groups/${m.groups.id}`}>{m.groups.name}</Link>
            {' '}(invite code: {m.groups.invite_code})
          </li>
        ))}
      </ul>

      <h2>Create a new group</h2>
      <CreateGroupForm userId={user.id} />

      <h2>Join a group</h2>
      <JoinGroupForm userId={user.id} />
    </main>
  );
}