const db = require("../dbClient");
const cancelProjectBillingPlanQuery = require("../../db/project/cancelProjectBillingPlan.sql");

function formatDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return String(value).split("T")[0];
}

function mapBillingPlan(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    billingType: row.billing_type,
    totalAmountCents: row.total_amount_cents,
    monthlyAmountCents: row.monthly_amount_cents,
    depositAmountCents: row.deposit_amount_cents,
    currency: row.currency,
    startDate: formatDateOnly(row.start_date),
    endDate: formatDateOnly(row.end_date),
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapInvoice(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    billingPlanId: row.billing_plan_id,
    invoiceNumber: row.invoice_number,
    amountCents: row.amount_cents,
    amountPaidCents: row.amount_paid_cents,
    balanceDueCents: row.balance_due_cents,
    currency: row.currency,
    dueDate: formatDateOnly(row.due_date),
    status: row.status,
    issuedAt: row.issued_at,
    paidAt: row.paid_at,
    periodStart: formatDateOnly(row.period_start),
    periodEnd: formatDateOnly(row.period_end),
    createdAt: row.created_at,
  };
}

async function cancelProjectBillingPlanService(validatedCancelBillingPlan) {
  const { projectId, billingPlanId, voidOpenInvoices } =
    validatedCancelBillingPlan;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const billingPlanResult = await client.query(
      cancelProjectBillingPlanQuery.getBillingPlanForProject,
      [billingPlanId, projectId],
    );

    if (billingPlanResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return {
        success: false,
        statusCode: 404,
        message: "Billing plan not found for this project.",
      };
    }

    const existingBillingPlan = billingPlanResult.rows[0];

    if (existingBillingPlan.status === "cancelled") {
      await client.query("ROLLBACK");

      return {
        success: false,
        statusCode: 409,
        message: "Billing plan is already cancelled.",
      };
    }

    if (existingBillingPlan.status === "completed") {
      await client.query("ROLLBACK");

      return {
        success: false,
        statusCode: 409,
        message: "Completed billing plans cannot be cancelled.",
      };
    }

    const cancelledBillingPlanResult = await client.query(
      cancelProjectBillingPlanQuery.cancelBillingPlan,
      [billingPlanId, projectId],
    );

    let voidedInvoices = [];

    if (voidOpenInvoices) {
      const voidedInvoicesResult = await client.query(
        cancelProjectBillingPlanQuery.voidOpenInvoicesForBillingPlan,
        [billingPlanId, projectId],
      );

      voidedInvoices = voidedInvoicesResult.rows.map(mapInvoice);
    }

    await client.query("COMMIT");

    return {
      success: true,
      statusCode: 200,
      message: "Billing plan cancelled successfully.",
      data: {
        billingPlan: mapBillingPlan(cancelledBillingPlanResult.rows[0]),
        voidedInvoices,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error cancelling project billing plan:", error);

    return {
      success: false,
      statusCode: 500,
      message: "Failed to cancel billing plan.",
    };
  } finally {
    client.release();
  }
}

module.exports = {
  cancelProjectBillingPlanService,
};
