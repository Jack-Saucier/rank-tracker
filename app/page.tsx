import GoogleSignInButton from '@/components/GoogleSignInButton';
import SignOutButton from '@/components/SignOutButton';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main>
      <h1>Rank Tracker</h1>
      {user ? (
        <>
          <p>Signed in as {user.email}</p>
          <SignOutButton />
          <p><a href="/groups">Go to your groups →</a></p>
        </>
      ) : (
        <>
          <p>Not signed in.</p>
          <GoogleSignInButton />
        </>
      )}
    </main>
  );
}