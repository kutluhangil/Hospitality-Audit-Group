/**
 * Thin-ruled circle enclosing a five-point star outline with a mono "H" at its
 * centre — the PDF identity reduced to line work. Drawn in currentColor so it
 * reads correctly in both themes.
 */
export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="20" r="18.5" strokeWidth="1" />
      <path
        d="M20 5.5 L23.9 15.2 L34.3 15.9 L26.3 22.6 L28.9 32.7 L20 27.1 L11.1 32.7 L13.7 22.6 L5.7 15.9 L16.1 15.2 Z"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <text
        x="20"
        y="24.2"
        textAnchor="middle"
        stroke="none"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="9"
        fontWeight="500"
      >
        H
      </text>
    </svg>
  );
}
