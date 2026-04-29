module.exports = {
  findPaymentByCheckoutSessionId: `
    SELECT
      id,
      invoice_id,
      project_id,
      company_id,
      amount_cents,
      currency,
      status,
      provider_checkout_session_id
    FROM payments
    WHERE provider = 'stripe'
      AND provider_checkout_session_id = $1
    LIMIT 1;
  `,

  markPaymentSucceeded: `
    UPDATE payments
    SET
      status = 'succeeded',
      provider_payment_id = $2
    WHERE id = $1
      AND status != 'succeeded'
    RETURNING
      id,
      invoice_id,
      project_id,
      company_id,
      amount_cents,
      currency,
      status;
  `,

  updateInvoiceAfterPayment: `
    UPDATE invoices
    SET
      amount_paid_cents = LEAST(amount_cents, COALESCE(amount_paid_cents, 0) + $2),
      balance_due_cents = GREATEST(
        0,
        amount_cents - LEAST(amount_cents, COALESCE(amount_paid_cents, 0) + $2)
      ),
      status = CASE
        WHEN GREATEST(
          0,
          amount_cents - LEAST(amount_cents, COALESCE(amount_paid_cents, 0) + $2)
        ) = 0 THEN 'paid'
        ELSE status
      END,
      paid_at = CASE
        WHEN GREATEST(
          0,
          amount_cents - LEAST(amount_cents, COALESCE(amount_paid_cents, 0) + $2)
        ) = 0 THEN NOW()
        ELSE paid_at
      END
    WHERE id = $1
    RETURNING
      id,
      invoice_number,
      amount_cents,
      amount_paid_cents,
      balance_due_cents,
      status,
      paid_at;
  `,

  insertPaymentEvent: `
    INSERT INTO payment_events (
      payment_id,
      invoice_id,
      provider,
      provider_event_id,
      event_type,
      processing_status,
      raw_payload,
      error_message,
      processed_at
    )
    VALUES ($1, $2, 'stripe', $3, $4, $5, $6, $7, NOW())
    RETURNING id;
  `,

  findPaymentEventByProviderEventId: `
    SELECT id
    FROM payment_events
    WHERE provider = 'stripe'
      AND provider_event_id = $1
    LIMIT 1;
  `,
};
