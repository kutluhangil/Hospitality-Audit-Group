import { FileLock2 } from "lucide-react";

import { Card } from "@/components/ui/Card";

type TrustBoxProps = {
  title: string;
  children: React.ReactNode;
};

/** Accent tone is the terracotta border only — the icon is decoration, never text. */
export function TrustBox({ title, children }: TrustBoxProps) {
  return (
    <Card tone="accent" className="md:p-8">
      <div className="flex gap-5">
        <FileLock2 aria-hidden className="mt-1 size-6 shrink-0 text-accent" />
        <div>
          <h3 className="font-serif text-xl md:text-2xl">{title}</h3>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted md:text-base">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
