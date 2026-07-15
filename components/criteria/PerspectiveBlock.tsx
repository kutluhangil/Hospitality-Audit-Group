import { Reveal } from "@/components/ui/Reveal";
import type { Perspective } from "@/lib/criteria/types";

/**
 * The owner/GM narratives that open the field guides. They are the most
 * persuasive writing in the whole methodology — an investor explaining, in their
 * own words, why this department is where money leaks — so they get the pull
 * quote treatment rather than being buried above a table.
 */
export function PerspectiveBlock({ perspectives }: { perspectives: readonly Perspective[] }) {
  return (
    <div className="space-y-10">
      {perspectives.map((perspective, index) => (
        <Reveal key={perspective.role} delay={index * 0.06}>
          <figure className="border-l-2 border-accent pl-5 md:pl-7">
            <figcaption className="font-mono text-xs uppercase tracking-[0.16em] text-accent-strong">
              {perspective.role}
            </figcaption>
            <blockquote className="mt-4 max-w-3xl text-base leading-relaxed text-ink md:text-lg">
              {perspective.body}
            </blockquote>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
