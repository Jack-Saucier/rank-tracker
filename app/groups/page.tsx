import { createClient } from '@/lib/supabase/server';
import CreateGroupForm from '@/components/CreateGroupForm';
import JoinGroupForm from '@/components/JoinGroupForm';
import LinkAccountForm from '@/components/LinkAccountForm';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import SiteHeader from '@/components/SiteHeader';
import GroupSearch from '@/components/GroupSearch';
export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main>
        <SiteHeader />
        <BackButton />
        <p className="subtitle">Please sign in to view your groups.</p>
      </main>
    );
  }
  const { data: memberships } = await supabase
    .from('group_members')
    .select('groups(id, name, invite_code)')
    .eq('user_id', user.id);
  return (
    <main>
      <SiteHeader />
      <BackButton />
      <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>your groups</h1>
      <p className="subtitle" style={{ marginBottom: '40px' }}>
        Create a group, share the invite code, and see who's climbing.
      </p>
      {memberships && memberships.length > 0 ? (
        <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
          {memberships.map((m: any) => (
            <Link key={m.groups.id} href={`/groups/${m.groups.id}`} style={{ textDecoration: 'none' }}>
              <div className="card group-card">
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{m.groups.name}</h3>
                  <span className="invite-chip">code: {m.groups.invite_code}</span>
                </div>
                <span className="gradient-text" style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '20px' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="subtitle" style={{ marginBottom: '40px' }}>You're not in any groups yet — create or join one below.</p>
      )}
      <div className="card">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>create a new group</h2>
        <CreateGroupForm userId={user.id} />
      </div>
      <div className="card">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>join a group</h2>
        <JoinGroupForm userId={user.id} />
      </div>
      <div className="card">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>find a public group</h2>
        <GroupSearch userId={user.id} />
      </div>
      <div className="card">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>link a game account</h2>
        <LinkAccountForm userId={user.id} />
      </div>
    </main>
  );
}