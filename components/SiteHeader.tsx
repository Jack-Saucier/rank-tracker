import Link from 'next/link';
import CrownIcon from '@/components/CrownIcon';

export default function SiteHeader() {
  return (
    <Link href="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
      <span className="logo-crown"><CrownIcon /></span>
      trackd
    </Link>
  );
}