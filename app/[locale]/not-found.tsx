import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "404 — kayıt bulunamadı",
  description: "Aradığınız sayfa bulunamadı. Ana sayfadan devam edebilirsiniz.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-content flex-col items-center justify-center px-4 py-24 sm:px-6">
      <div className="w-full max-w-xl rounded-xl2 bg-terminal-bg p-6 font-mono text-sm text-terminal-ink sm:p-8">
        <p>
          {/* Accent is legible on the terminal panel but stays a glyph, never a
              sentence — the same licence the audit log's ✗ takes. */}
          <span className="text-accent">$</span> hag find --page=&quot;...&quot;
        </p>
        <h1 className="mt-4 text-base font-normal">404 — kayıt bulunamadı</h1>
      </div>

      <Button href="/" size="lg" className="mt-8">
        Ana sayfaya dön
      </Button>
    </main>
  );
}
