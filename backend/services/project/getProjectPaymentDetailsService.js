const db = require("../dbClient");
const getProjectPaymentDetailsQuery = require("../../db/project/getProjectPaymentDetails.sql");

function formatDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return String(value);
}

function formatDateTime(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function mapPaymentDetailsRow(row) {
  return {
    projectId: row.project_id,
    companyId: row.company_id,
    companyName: row.company_name,
    projectName: row.project_name,

    billingPlan: row.billing_plan_id
      ? {
          id: row.billing_plan_id,
          billingType: row.billing_type,
          status: row.billing_status,
          currency: row.billing_currency,
          totalAmountCents: row.total_amount_cents,
          monthlyAmountCents: row.monthly_amount_cents,
          depositAmountCents: row.deposit_amount_cents,
          startDate: formatDateOnly(row.billing_start_date),
          endDate: formatDateOnly(row.billing_end_date),
        }
      : null,

    invoice: row.invoice_id
      ? {
          id: row.invoice_id,
          invoiceNumber: row.invoice_number,
          amountCents: row.amount_cents,
          amountPaidCents: row.amount_paid_cents,
          balanceDueCents: row.balance_due_cents,
          currency: row.invoice_currency,
          dueDate: formatDateOnly(row.due_date),
          status: row.invoice_status,
          issuedAt: formatDateTime(row.issued_at),
          paidAt: formatDateTime(row.paid_at),
          periodStart: formatDateOnly(row.period_start),
          periodEnd: formatDateOnly(row.period_end),
        }
      : null,
  };
}

async function getProjectPaymentDetailsService(projectId) {
  const result = await db.query(
    getProjectPaymentDetailsQuery.getProjectPaymentDetails,
    [projectId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapPaymentDetailsRow(result.rows[0]);
}

module.exports = {
  getProjectPaymentDetailsService,
};
