import GoogleSignInButton from '@/components/GoogleSignInButton';
import SignOutButton from '@/components/SignOutButton';
import CrownIcon from '@/components/CrownIcon';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main>
      <div className="logo">
        <span className="logo-crown"><CrownIcon /></span>
        trackd
      </div>

      <section className="hero">
        <div className="hero-copy">
          <h1 className="hero-title">
            use<br />
            <span className="gradient-text">trackd</span>
          </h1>

          <p className="subtitle">
            Compare your in-game ranks with friends, classmates, and family. No manual entry — just real ranks, tracked automatically.
          </p>

          {user ? (
            <>
              <p className="subtitle" style={{ marginBottom: '16px' }}>Signed in as {user.email}</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="/groups" className="btn-gradient" style={{ display: 'inline-block' }}>
                  Go to your groups
                </a>
                <SignOutButton />
              </div>
            </>
          ) : (
            <GoogleSignInButton />
          )}
        </div>

        <div className="hero-crown-glow">
          <CrownIcon size={220} />
        </div>
      </section>

      <section className="how-it-works">
        <h2 style={{ fontSize: '28px', marginBottom: '32px' }}>how it works</h2>
        <div className="steps">
          <div className="card step">
            <span className="step-number">01</span>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Sign in</h3>
            <p className="subtitle" style={{ fontSize: '15px', margin: 0 }}>
              Log in with Google — no new password to remember.
            </p>
          </div>
          <div className="card step">
            <span className="step-number">02</span>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Link your account</h3>
            <p className="subtitle" style={{ fontSize: '15px', margin: 0 }}>
              Connect your Rocket League account — ranks are pulled automatically, never typed in by hand.
            </p>
          </div>
          <div className="card step">
            <span className="step-number">03</span>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Join a group</h3>
            <p className="subtitle" style={{ fontSize: '15px', margin: 0 }}>
              Create or join a group with an invite code, and see how you stack up.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}