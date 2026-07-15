import Image from "next/image";

/**
 * Frames an illustration on cream stock, in both themes.
 *
 * The artwork has the paper baked into it, so it cannot invert. Rather than
 * fight that with blend modes, the frame commits: illustrations are the report,
 * and the report is always on paper — the exact mirror of the terminal panel,
 * which stays dark in both themes because it is always the field.
 */
export function PaperFigure({
  src,
  alt,
  priority = false,
  className,
  sizes = "(min-width: 1024px) 32rem, 100vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure
      className={[
        "overflow-hidden rounded-xl2 border border-paper-line bg-paper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        width={1024}
        height={1024}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full"
      />
    </figure>
  );
}
