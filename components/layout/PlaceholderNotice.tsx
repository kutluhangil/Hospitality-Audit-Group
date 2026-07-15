import { TriangleAlert } from "lucide-react";

import { company } from "@/lib/company-data";

/**
 * Renders while lib/company-data.ts is still standing in for the real thing.
 *
 * Shown outside production only. It is not the safety net — robots.txt already
 * refuses crawlers on the same flag, and next.config.mjs prints a warning into
 * every build log. This is the reminder for whoever is looking at the page.
 */
export function PlaceholderNotice() {
  if (!company.isPlaceholder || process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      role="status"
      className="flex items-start gap-2.5 border-b border-accent/40 bg-accent/10 px-6 py-2.5"
    >
      <TriangleAlert size={15} className="mt-0.5 shrink-0 text-accent-strong" aria-hidden="true" />
      <p className="font-mono text-[0.6875rem] leading-relaxed tracking-wide text-ink">
        <strong className="font-medium">PLACEHOLDER İÇERİK</strong> — kuruluş öyküsü ve kadro
        rakamları geçicidir. Yayına almadan önce{" "}
        <code className="text-accent-strong">lib/company-data.ts</code> doldurulup{" "}
        <code className="text-accent-strong">isPlaceholder: false</code> yapılmalı. Bu bayrak
        açıkken robots.txt arama motorlarını da engelliyor.
      </p>
    </div>
  );
}
