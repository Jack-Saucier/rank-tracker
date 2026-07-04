import './globals.css';

export const metadata = {
  title: "trackd",
  description: "Compare your in-game ranks with friends, classmates, and family.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}