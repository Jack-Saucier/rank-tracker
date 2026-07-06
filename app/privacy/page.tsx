export const metadata = {
  title: "Privacy Policy | trackd",
  description: "Privacy Policy for trackd — the game rank tracker.",
};

export default function PrivacyPolicy() {
  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "48px 24px",
        color: "#e5e7eb",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Privacy Policy
      </h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>
        Last updated: [07/06/2026]
      </p>

      <p>
        trackd (&quot;we,&quot; &quot;us,&quot; or &quot;the app&quot;) lets
        users track and compare in-game ranks across friend groups. This
        policy explains what information we collect, how we use it, and the
        choices you have.
      </p>

      <h2 style={sectionHeading}>1. Who We Are</h2>
      <p>
        trackd is an independently developed, non-commercial project at this
        time. If you have questions about this policy or your data, contact
        us at{" "}
        <a href="mailto:jacksonbsaucier@gmail.com">
          jacksonbsaucier@gmail.com
        </a>
        .
      </p>

      <h2 style={sectionHeading}>2. Information We Collect</h2>
      <p>When you sign in with Google, we receive and store:</p>
      <ul style={listStyle}>
        <li>Your name and email address (from Google OAuth)</li>
        <li>A profile identifier used to link your account to your data</li>
      </ul>
      <p>When you use the app, we additionally store:</p>
      <ul style={listStyle}>
        <li>
          Game accounts you choose to link (game, platform, and your
          in-game username)
        </li>
        <li>
          Rank and MMR history for those linked accounts, fetched
          periodically from third-party game statistics services
        </li>
        <li>Groups you create or join, and their membership</li>
      </ul>
      <p>
        We do not collect payment information, precise location, or any
        data beyond what is necessary to operate the ranking and
        leaderboard features described above.
      </p>

      <h2 style={sectionHeading}>3. How We Use Information</h2>
      <p>We use the information above only to:</p>
      <ul style={listStyle}>
        <li>Create and maintain your account</li>
        <li>Display your linked game accounts and rank history to you and to members of your groups</li>
        <li>Generate leaderboards within groups you belong to</li>
        <li>Operate core app functionality (e.g. showing when the next rank update will run)</li>
      </ul>
      <p>
        We do not sell your information, and we do not use it for targeted
        or behavioral advertising.
      </p>

      <h2 style={sectionHeading}>4. Third-Party Services</h2>
      <p>We rely on the following third parties to operate trackd:</p>
      <ul style={listStyle}>
        <li>
          <strong>Google</strong> — for authentication (sign-in)
        </li>
        <li>
          <strong>Supabase</strong> — for database storage and hosting of
          user accounts, linked game accounts, and rank history
        </li>
        <li>
          <strong>Vercel</strong> — for hosting the website
        </li>
        <li>
          <strong>Third-party game statistics providers</strong> — used
          solely to fetch publicly available rank/stat data for the game
          accounts you link. We only send your linked in-game username(s)
          to these services in order to retrieve your stats.
        </li>
      </ul>
      <p>
        Each of these providers has its own privacy practices, and we
        encourage you to review them.
      </p>

      <h2 style={sectionHeading}>5. Data Sharing Within Groups</h2>
      <p>
        If you join or create a group, your linked game accounts and rank
        history become visible to other members of that group on shared
        leaderboards. Group membership and invite codes are managed by the
        group creator.
      </p>

      <h2 style={sectionHeading}>6. Children&apos;s Privacy</h2>
      <p>
        trackd is intended for use by students and classmates and may be
        used by individuals under the age of 18. We do not knowingly
        collect more information from children than is described in this
        policy, we do not run targeted advertising, and we do not sell
        data belonging to any user, including minors. If you are a parent
        or guardian and believe your child has provided us with
        information you did not consent to, contact us at the email above
        and we will delete it.
      </p>

      <h2 style={sectionHeading}>7. Data Retention &amp; Deletion</h2>
      <p>
        We retain your account and rank history for as long as your
        account remains active. You may request deletion of your account
        and all associated data at any time by contacting us at the email
        above.
      </p>

      <h2 style={sectionHeading}>8. Data Security</h2>
      <p>
        We use industry-standard tools (Supabase, Google OAuth) to store
        and secure your data, and restrict write access to your data to
        you and to automated processes required to keep rank data current.
        No method of storage or transmission is 100% secure, and we cannot
        guarantee absolute security.
      </p>

      <h2 style={sectionHeading}>9. Your Choices</h2>
      <ul style={listStyle}>
        <li>You may unlink a game account at any time.</li>
        <li>You may leave a group at any time.</li>
        <li>You may request full account deletion at any time.</li>
      </ul>

      <h2 style={sectionHeading}>10. Changes to This Policy</h2>
      <p>
        We may update this policy as the app changes. We will update the
        &quot;Last updated&quot; date above when we do. Continued use of
        trackd after changes means you accept the updated policy.
      </p>

      <h2 style={sectionHeading}>11. Contact Us</h2>
      <p>
        Questions about this policy or your data? Email{" "}
        <a href="mailto:jacksonbsaucier@gmail.com">
          jacksonbsaucier@gmail.com
        </a>
        .
      </p>
    </main>
  );
}

const sectionHeading: React.CSSProperties = {
  fontSize: "1.25rem",
  marginTop: "2rem",
  marginBottom: "0.75rem",
};

const listStyle: React.CSSProperties = {
  paddingLeft: "1.5rem",
  marginBottom: "1rem",
};