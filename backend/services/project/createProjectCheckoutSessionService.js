const Stripe = require("stripe");
const db = require("../dbClient");
const checkoutQueries = require("../../db/project/createProjectCheckoutSession.sql");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class CheckoutSessionError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "CheckoutSessionError";
    this.statusCode = statusCode;
  }
}

async function createProjectCheckoutSessionService({ projectId, invoiceId }) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new CheckoutSessionError("Stripe secret key is not configured.", 500);
  }

  if (!process.env.FRONTEND_URL) {
    throw new CheckoutSessionError("Frontend URL is not configured.", 500);
  }

  const invoiceResult = await db.query(
    checkoutQueries.getPayableInvoiceForCheckout,
    [projectId, invoiceId || null],
  );

  if (invoiceResult.rows.length === 0) {
    throw new CheckoutSessionError(
      "No payable invoice was found for this project.",
      404,
    );
  }

  const row = invoiceResult.rows[0];

  if (row.billing_type === "monthly") {
    throw new CheckoutSessionError(
      "Monthly recurring payments are not supported yet.",
      400,
    );
  }

  if (!["one_time", "installments"].includes(row.billing_type)) {
    throw new CheckoutSessionError("Unsupported billing type.", 400);
  }

  const balanceDueCents = Number(row.balance_due_cents);

  if (!Number.isFinite(balanceDueCents) || balanceDueCents <= 0) {
    throw new CheckoutSessionError("Invoice does not have a payable balance.");
  }

  const currency = String(row.currency || "usd").toLowerCase();

  const paymentResult = await db.query(
    checkoutQueries.insertPendingStripePayment,
    [row.invoice_id, row.project_id, row.company_id, balanceDueCents, currency],
  );

  const paymentId = paymentResult.rows[0].id;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: balanceDueCents,
          product_data: {
            name: `${row.project_name} - Invoice ${row.invoice_number}`,
            description: `Payment for ${row.company_name}`,
          },
        },
      },
    ],

    success_url: `${process.env.FRONTEND_URL}/client/${row.project_id}/payment/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/client/${row.project_id}/payment/checkout?canceled=true`,

    metadata: {
      paymentId,
      projectId: row.project_id,
      companyId: row.company_id,
      invoiceId: row.invoice_id,
      billingPlanId: row.billing_plan_id,
      billingType: row.billing_type,
    },

    payment_intent_data: {
      metadata: {
        paymentId,
        projectId: row.project_id,
        companyId: row.company_id,
        invoiceId: row.invoice_id,
      },
    },
  });

  await db.query(checkoutQueries.attachStripeCheckoutSessionToPayment, [
    session.id,
    paymentId,
  ]);

  return {
    checkoutUrl: session.url,
  };
}

module.exports = {
  createProjectCheckoutSessionService,
  CheckoutSessionError,
};
