const db = require("../dbClient");
const getProjectDetailsQuery = require("../../db/project/getProjectDetails.sql");

function formatDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    return value.split("T")[0];
  }

  return null;
}

function formatMoneyFromCents(amountCents, currency = "USD") {
  if (amountCents === null || amountCents === undefined) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

function formatInvoiceStatus(status) {
  if (!status) return "No Invoice";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getProjectDetailsService(projectId) {
  const result = await db.query(getProjectDetailsQuery.getProjectDetails, [
    projectId,
  ]);

  if (result.rows.length === 0) return null;

  const row = result.rows[0];

  const invoiceDueDate = formatDateOnly(row.billing_due_date);

  const billing = row.billing_invoice_id
    ? {
        invoiceId: row.billing_invoice_id,
        invoiceLabel: row.billing_invoice_number,
        status: formatInvoiceStatus(row.billing_status),
        rawStatus: row.billing_status,
        invoiceAmountCents: row.billing_amount_cents,
        amountPaidCents: row.billing_amount_paid_cents,
        balanceDueCents: row.billing_balance_due_cents,
        amountDue: formatMoneyFromCents(
          row.billing_balance_due_cents,
          row.billing_currency,
        ),
        dueDate: invoiceDueDate || "No Due Date",
      }
    : null;

  return {
    id: row.project_id,
    name: row.project_name,
    currentPhase: row.project_current_phase,
    nextStep: row.project_next_step,
    status: row.project_status,
    startDate: formatDateOnly(row.project_start_date),
    targetLaunchDate: formatDateOnly(row.project_target_launch_date),
    clientVisibleSummary: row.project_client_visible_summary,
    updates: row.updates,
    milestones: row.milestones,
    documents: row.documents,

    balanceDue: billing ? billing.amountDue : null,
    invoiceDueDate,
    billing,
  };
}

module.exports = { getProjectDetailsService };
