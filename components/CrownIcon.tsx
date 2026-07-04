export default function CrownIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Purple shadow layer, offset behind */}
      <path
        d="M8 32 L28 48 L50 14 L72 48 L92 32 L84 74 L16 74 Z"
        fill="var(--purple)"
        transform="translate(4, 6)"
      />
      {/* Red crown on top */}
      <path
        d="M8 32 L28 48 L50 14 L72 48 L92 32 L84 74 L16 74 Z"
        fill="var(--crown-red)"
      />
    </svg>
  );
}