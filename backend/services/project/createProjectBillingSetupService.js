const db = require("../dbClient");
const createProjectBillingSetupQuery = require("../../db/project/createProjectBillingSetup.sql");

function mapBillingPlan(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    billingType: row.billing_type,
    totalAmountCents: row.total_amount_cents,
    monthlyAmountCents: row.monthly_amount_cents,
    depositAmountCents: row.deposit_amount_cents,
    currency: row.currency,
    startDate: row.start_date,
    endDate: row.end_date,
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
    dueDate: row.due_date,
    status: row.status,
    issuedAt: row.issued_at,
    paidAt: row.paid_at,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    createdAt: row.created_at,
  };
}

async function createProjectBillingSetupService(validatedBillingSetup) {
  const { projectId, billingPlan, invoice } = validatedBillingSetup;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      createProjectBillingSetupQuery.checkProjectExists,
      [projectId],
    );

    if (projectResult.rows.length === 0) {
      await client.query("ROLLBACK");
      console.log("project not found");
      return {
        success: false,
        statusCode: 404,
        message: "Project not found.",
      };
    }

    const activePlanResult = await client.query(
      createProjectBillingSetupQuery.checkActiveBillingPlanExists,
      [projectId],
    );

    if (activePlanResult.rows.length > 0 && billingPlan.status === "active") {
      await client.query("ROLLBACK");
      console.log("This project already has an active billing plan.");
      return {
        success: false,
        statusCode: 409,
        message: "This project already has an active billing plan.",
      };
    }

    const billingPlanResult = await client.query(
      createProjectBillingSetupQuery.insertBillingPlan,
      [
        projectId,
        billingPlan.billingType,
        billingPlan.totalAmountCents,
        billingPlan.monthlyAmountCents,
        billingPlan.depositAmountCents,
        billingPlan.currency,
        billingPlan.startDate,
        billingPlan.endDate,
        billingPlan.status,
      ],
    );

    const createdBillingPlan = billingPlanResult.rows[0];

    const invoiceResult = await client.query(
      createProjectBillingSetupQuery.insertInvoice,
      [
        projectId,
        createdBillingPlan.id,
        invoice.invoiceNumber,
        invoice.amountCents,
        invoice.currency,
        invoice.dueDate,
        invoice.status,
        invoice.periodStart,
        invoice.periodEnd,
      ],
    );

    const createdInvoice = invoiceResult.rows[0];

    await client.query("COMMIT");

    return {
      success: true,
      statusCode: 201,
      data: {
        billingPlan: mapBillingPlan(createdBillingPlan),
        invoice: mapInvoice(createdInvoice),
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error creating project billing setup:", error);

    return {
      success: false,
      statusCode: 500,
      message: "Failed to create billing setup.",
    };
  } finally {
    client.release();
  }
}

module.exports = {
  createProjectBillingSetupService,
};
