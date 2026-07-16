import Image from "next/image";

export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/images/logo.png"
      alt="Hospitality Audit Group Logo"
      width={size}
      height={size}
      className={`object-contain dark:invert ${className || ""}`}
      aria-hidden="true"
    />
  );
}
