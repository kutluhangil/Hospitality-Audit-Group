import { getTranslations } from "next-intl/server";

import { BillingForm } from "@/components/forms/BillingForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { isPaymentEnabled } from "@/lib/payment";

/**
 * The card path, and the gate in front of it.
 *
 * A server component on purpose. `isPaymentEnabled()` reads credentials, so the
 * check has to happen where the credentials are — and gating here rather than
 * inside the client form means that when payment is off, the form is not hidden
 * with CSS or skipped at runtime: it is never rendered, and no billing markup,
 * no consent checkbox and no submit target reach the page the visitor receives.
 *
 * One honest caveat, measured rather than assumed. Next builds a route's client
 * manifest from the static module graph, not from what the server rendered, so
 * BillingForm's compiled chunk is still among /teklif's <script> tags even when
 * this returns null. Its field labels and the /api/odeme path are therefore
 * readable in the bundle by anyone who looks. That is a disclosure of an
 * unreleased feature, not a way to use it: nothing renders, and the route
 * answers 503 regardless of what a client sends. Wrapping this in next/dynamic
 * was tried and does NOT remove the chunk — the client reference is registered
 * either way. Removing it for real means the payment UI cannot be reachable via
 * a static import from a page that ships while payment is off.
 *
 * Returning null is the entire disabled state. No "yakında" notice, no greyed-out
 * button. A payment button that cannot take money should not be on the page at
 * all — see the comment block in lib/payment.ts.
 */
export async function PaymentSection() {
  if (!isPaymentEnabled()) return null;

  const t = await getTranslations("quotePage.paymentSection");

  return (
    <section id="kart-ile-ode" className="scroll-mt-24">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
        {t("title")}
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        {t("body")}
      </p>

      <div className="mt-8">
        <BillingForm />
      </div>
    </section>
  );
}
