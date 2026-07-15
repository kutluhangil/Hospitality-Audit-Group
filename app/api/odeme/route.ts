import { NextResponse } from "next/server";

import {
  billingTotals,
  createOrderReference,
  formatValidationErrors,
  validateBillingRequest,
} from "@/lib/billing-schema";
import { PaymentError, createPaymentSession, isPaymentEnabled } from "@/lib/payment";
import { siteConfig } from "@/lib/site-config";

// node:crypto and the provider signing in lib/payment.ts will not run on the edge.
export const runtime = "nodejs";

/**
 * Opens a card payment.
 *
 * This route has NO development fallback, and that asymmetry with /api/teklif is
 * the point. The quote route answers 200 and logs when RESEND_API_KEY is absent,
 * because a lost quote costs nobody anything. Here the only thing this route
 * could fake is a receipt, so when the payment path is off it says so — 503, in
 * plain Turkish — and nothing else. There is no branch below that reports success
 * without a session the provider actually opened. See lib/payment.ts.
 */
const PAYMENT_DISABLED =
  "Kart ile ödeme şu anda kullanıma kapalı. Aynı hizmetler için teklif formundan ilerleyebilirsiniz.";

/** Shown to the buyer. The real cause goes to the server log, never to the browser. */
const PROVIDER_FAILURE =
  `Ödeme başlatılamadı. Kartınızdan herhangi bir çekim yapılmadı. ` +
  `Lütfen birkaç dakika sonra tekrar deneyin veya ${siteConfig.contact.email} adresine yazın.`;

/**
 * The buyer's address as the provider's fraud checks want it. Vercel puts the
 * real client first in x-forwarded-for; request.ip does not exist in this runtime.
 */
function clientIpOf(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;
  return request.headers.get("x-real-ip")?.trim() || "127.0.0.1";
}

export async function POST(request: Request): Promise<NextResponse> {
  // Checked first, before the body is even read: a disabled feature has no
  // request to validate and no error to report about one.
  if (!isPaymentEnabled()) {
    return NextResponse.json({ error: PAYMENT_DISABLED }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error("[api/odeme] Request body was not valid JSON:", error);
    return NextResponse.json({ error: "İstek gövdesi geçerli bir JSON değil." }, { status: 400 });
  }

  const result = validateBillingRequest(body);
  if (!result.ok) {
    return NextResponse.json({ error: formatValidationErrors(result.errors) }, { status: 400 });
  }

  const billing = result.value;

  // The authority on the amount. Whatever the request body said about money was
  // discarded by the validator; this is computed from the catalogue, right here,
  // and it is the number the provider is told to charge.
  const totals = billingTotals(billing.selectedItems);
  if (totals.total <= 0) {
    console.error(
      `[api/odeme] Basket ${billing.selectedItems.join(", ")} priced at ${totals.total}. ` +
        "A payable order cannot be free — check lib/modules-data.ts.",
    );
    return NextResponse.json({ error: PROVIDER_FAILURE }, { status: 500 });
  }

  const reference = createOrderReference();

  try {
    const session = await createPaymentSession({
      reference,
      amount: totals.total,
      items: billing.selectedItems,
      billing,
      ip: clientIpOf(request),
      // Taken from the live request so the 3-D return lands on the same
      // deployment the buyer started from, previews included.
      origin: new URL(request.url).origin,
    });

    console.log(
      `[api/odeme] Opened payment ref=${reference} amount=${totals.total} ` +
        `items=${billing.selectedItems.join(",")}`,
    );

    return NextResponse.json({ ok: true, redirectUrl: session.redirectUrl, ref: reference });
  } catch (error) {
    // A provider that throws is a real error, logged with its real cause. It is
    // never smoothed over into a success, and the buyer is told plainly that
    // nothing was charged — which is true: no card has been entered yet.
    if (error instanceof PaymentError) {
      console.error(`[api/odeme] Provider failed to open payment ref=${reference}:`, error.message, error.cause);
    } else {
      console.error(`[api/odeme] Unexpected failure opening payment ref=${reference}:`, error);
    }
    return NextResponse.json({ error: PROVIDER_FAILURE }, { status: 500 });
  }
}
