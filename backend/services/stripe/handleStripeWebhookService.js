const db = require("../dbClient");
const stripeWebhookQueries = require("../../db/stripe/stripeWebhook.sql");

async function insertPaymentEvent({
  paymentId,
  invoiceId,
  providerEventId,
  eventType,
  processingStatus,
  rawPayload,
  errorMessage = null,
}) {
  await db.query(stripeWebhookQueries.insertPaymentEvent, [
    paymentId,
    invoiceId,
    providerEventId,
    eventType,
    processingStatus,
    rawPayload,
    errorMessage,
  ]);
}

async function hasAlreadyProcessedEvent(providerEventId) {
  const result = await db.query(
    stripeWebhookQueries.findPaymentEventByProviderEventId,
    [providerEventId],
  );

  return result.rows.length > 0;
}

async function handleCheckoutSessionCompleted(event) {
  const session = event.data.object;

  const checkoutSessionId = session.id;
  const providerPaymentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  const alreadyProcessed = await hasAlreadyProcessedEvent(event.id);

  if (alreadyProcessed) {
    return {
      status: "skipped",
      reason: "Stripe event already processed.",
    };
  }

  if (session.mode !== "payment") {
    await insertPaymentEvent({
      paymentId: null,
      invoiceId: null,
      providerEventId: event.id,
      eventType: event.type,
      processingStatus: "skipped",
      rawPayload: event,
      errorMessage: `Unsupported checkout mode: ${session.mode}`,
    });

    return {
      status: "skipped",
      reason: `Unsupported checkout mode: ${session.mode}`,
    };
  }

  if (session.payment_status !== "paid") {
    await insertPaymentEvent({
      paymentId: null,
      invoiceId: null,
      providerEventId: event.id,
      eventType: event.type,
      processingStatus: "skipped",
      rawPayload: event,
      errorMessage: `Checkout session payment_status was ${session.payment_status}`,
    });

    return {
      status: "skipped",
      reason: `Checkout session payment_status was ${session.payment_status}`,
    };
  }

  const paymentResult = await db.query(
    stripeWebhookQueries.findPaymentByCheckoutSessionId,
    [checkoutSessionId],
  );

  if (paymentResult.rows.length === 0) {
    await insertPaymentEvent({
      paymentId: null,
      invoiceId: null,
      providerEventId: event.id,
      eventType: event.type,
      processingStatus: "failed",
      rawPayload: event,
      errorMessage: "No matching payment found for checkout session.",
    });

    throw new Error("No matching payment found for checkout session.");
  }

  const payment = paymentResult.rows[0];

  const updatedPaymentResult = await db.query(
    stripeWebhookQueries.markPaymentSucceeded,
    [payment.id, providerPaymentId],
  );

  if (updatedPaymentResult.rows.length === 0) {
    await insertPaymentEvent({
      paymentId: payment.id,
      invoiceId: payment.invoice_id,
      providerEventId: event.id,
      eventType: event.type,
      processingStatus: "skipped",
      rawPayload: event,
      errorMessage: "Payment was already marked as succeeded.",
    });

    return {
      status: "skipped",
      reason: "Payment was already marked as succeeded.",
    };
  }

  const updatedPayment = updatedPaymentResult.rows[0];

  await db.query(stripeWebhookQueries.updateInvoiceAfterPayment, [
    updatedPayment.invoice_id,
    updatedPayment.amount_cents,
  ]);

  await insertPaymentEvent({
    paymentId: updatedPayment.id,
    invoiceId: updatedPayment.invoice_id,
    providerEventId: event.id,
    eventType: event.type,
    processingStatus: "processed",
    rawPayload: event,
  });

  return {
    status: "processed",
    paymentId: updatedPayment.id,
    invoiceId: updatedPayment.invoice_id,
  };
}

async function handleStripeWebhookService(event) {
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(event);

    default:
      return {
        status: "ignored",
        eventType: event.type,
      };
  }
}

module.exports = {
  handleStripeWebhookService,
};
