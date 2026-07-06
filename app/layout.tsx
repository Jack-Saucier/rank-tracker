import './globals.css';
import NextUpdateTimer from '@/components/NextUpdateTimer';

export const metadata = {
  title: "trackd",
  description: "Compare your in-game ranks with friends, classmates, and family.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
  	<div className="bg-shape bg-shape-1"></div>
  	<div className="bg-shape bg-shape-2"></div>
  	<div className="bg-shape bg-shape-3"></div>
  	<div className="bg-shape bg-shape-4"></div>
  	<div className="bg-shape bg-shape-5"></div>
  	<div className="bg-shape bg-shape-6"></div>
        <NextUpdateTimer />
  	{children}
      </body>
    </html>
  );
}