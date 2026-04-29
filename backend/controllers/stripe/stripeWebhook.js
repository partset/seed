const Stripe = require("stripe");
const {
  handleStripeWebhookService,
} = require("../../services/stripe/handleStripeWebhookService");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function stripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET.");
    return res.status(500).send("Stripe webhook secret is not configured.");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message,
    );
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    await handleStripeWebhookService(event);

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Failed to handle Stripe webhook:", error);

    return res.status(500).json({
      received: false,
      error: "Failed to handle Stripe webhook.",
    });
  }
}

module.exports = {
  stripeWebhook,
};
