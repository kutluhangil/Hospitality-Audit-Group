import { NextResponse } from "next/server";

import { PaymentError, isPaymentEnabled, resolveCallback, signOutcome } from "@/lib/payment";

export const runtime = "nodejs";

/**
 * The 3-D Secure return.
 *
 * The provider POSTs the buyer's browser here after they leave the card page.
 * Two rules govern this handler:
 *
 *   1. The callback body is a claim, not a fact. Anyone on the internet can POST
 *      this URL with status=success in the form. Nothing in the body is read
 *      except the token identifying the attempt; the outcome is fetched from the
 *      provider directly and its signature verified before we believe it.
 *      (Both of those happen in lib/payment.ts — this route never sees them.)
 *
 *   2. A buyer arrives here in a browser, having possibly just been charged. So
 *      the answer is a redirect to a page, not JSON — but the redirect carries a
 *      signed outcome, so /odeme/sonuc cannot be talked into showing a receipt
 *      by someone editing the query string.
 */

/** 303 turns the provider's POST into a GET, so a refresh does not re-post it. */
const SEE_OTHER = 303;

function resultUrl(request: Request, token: string): URL {
  const url = new URL("/odeme/sonuc", request.url);
  url.searchParams.set("d", token);
  return url;
}

export async function POST(request: Request): Promise<NextResponse | Response> {
  if (!isPaymentEnabled()) {
    // Nothing can have been paid through a path that does not exist, so there is
    // no buyer to redirect and nothing to resolve.
    console.error("[api/odeme/callback] Received a callback while payment is disabled. Ignoring.");
    return NextResponse.json({ error: "Ödeme yolu kapalı." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch (error) {
    console.error("[api/odeme/callback] Callback body was not form data:", error);
    return NextResponse.json({ error: "Geçersiz geri dönüş isteği." }, { status: 400 });
  }

  try {
    const outcome = await resolveCallback(form);
    console.log(
      `[api/odeme/callback] Resolved ref=${outcome.reference} status=${outcome.status} ` +
        `paymentId=${outcome.providerPaymentId ?? "—"} paid=${outcome.paidAmount ?? "—"}`,
    );
    return NextResponse.redirect(resultUrl(request, signOutcome(outcome)), SEE_OTHER);
  } catch (error) {
    const cause = error instanceof PaymentError ? error.cause : undefined;
    console.error("[api/odeme/callback] Could not resolve the payment outcome:", error, cause);

    // We could not establish what happened — the provider was unreachable, or its
    // answer did not verify. The buyer may or may not have been charged, and both
    // "başarılı" and "başarısız" would be a guess about their bank account. So we
    // say exactly that instead. Ambiguity gets reported, never resolved by
    // picking the convenient answer.
    const conversationId = form.get("conversationId");
    const outcomeToken = signOutcome({
      status: "unknown",
      reference: typeof conversationId === "string" ? conversationId : "",
      providerPaymentId: null,
      paidAmount: null,
      failureReason: null,
    });
    return NextResponse.redirect(resultUrl(request, outcomeToken), SEE_OTHER);
  }
}
