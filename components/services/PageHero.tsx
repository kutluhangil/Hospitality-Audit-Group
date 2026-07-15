import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede: string;
};

/** The single h1 of a page. Every route using this must not render another. */
export function PageHero({ eyebrow, title, lede }: PageHeroProps) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {lede}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
