import GoogleSignInButton from '@/components/GoogleSignInButton';
import SignOutButton from '@/components/SignOutButton';
import CrownIcon from '@/components/CrownIcon';
import { createClient } from '@/lib/supabase/server';
import SiteHeader from '@/components/SiteHeader';
import { RocketLeagueIcon, FortniteIcon, OverwatchIcon, R6Icon } from '@/components/GameIcons';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main>
      <SiteHeader />

      <section className="hero">
        <div className="hero-copy">
          <h1 className="hero-title">
            use<br />
            <span className="gradient-text">trackd</span>
          </h1>

          <p className="subtitle">
            compare your in-game ranks with friends, classmates, and family.  just sign in and find out if you're the best. 
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
              log in with Google
            </p>
          </div>
          <div className="card step">
            <span className="step-number">02</span>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Link your account</h3>
            <p className="subtitle" style={{ fontSize: '15px', margin: 0 }}>
              ranks are pulled automatically, just enter your platform, game, and display name            </p>
          </div>
          <div className="card step">
            <span className="step-number">03</span>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Join a group</h3>
            <p className="subtitle" style={{ fontSize: '15px', margin: 0 }}>
              create or join a group with an invite code. are you better?
            </p>
          </div>
        </div>
      </section>
      <section className="games-section">
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>track your rank in</h2>
        <p className="subtitle" style={{ marginBottom: '32px' }}>More games coming as we add support.</p>
        <div className="games-grid">
          <div className="card game-card">
            <RocketLeagueIcon />
            <span>Rocket League</span>
          </div>
          <div className="card game-card">
            <FortniteIcon />
            <span>Fortnite</span>
          </div>
          <div className="card game-card">
            <OverwatchIcon />
            <span>Overwatch</span>
          </div>
          <div className="card game-card">
            <R6Icon />
            <span>Rainbow Six Siege</span>
          </div>
        </div>
      </section>
    </main>
  );
}