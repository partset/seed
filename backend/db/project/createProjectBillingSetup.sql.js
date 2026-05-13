module.exports = {
  checkProjectExists: `
    SELECT 
        id,
        company_id
    FROM projects
    WHERE id = $1;
  `,

  checkActiveBillingPlanExists: `
    SELECT id
    FROM billing_plans
    WHERE project_id = $1
        AND status = 'active'
    LIMIT 1;
  `,

  insertBillingPlan: `
    INSERT INTO billing_plans (
        project_id,
        billing_type,
        total_amount_cents,
        monthly_amount_cents,
        deposit_amount_cents,
        currency,
        start_date,
        end_date,
        status
    )
    VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
    RETURNING
        id,
        project_id,
        billing_type,
        total_amount_cents,
        monthly_amount_cents,
        deposit_amount_cents,
        currency,
        start_date,
        end_date,
        status,
        created_at;
  `,

  insertInvoice: `
    INSERT INTO invoices (
        project_id,
        billing_plan_id,
        invoice_number,
        amount_cents,
        amount_paid_cents,
        balance_due_cents,
        currency,
        due_date,
        status,
        issued_at,
        period_start,
        period_end
    )
    VALUES (
        $1, $2, $3, $4, 0, $4, $5, $6, $7, NOW(), $8, $9
    )
    RETURNING
        id,
        project_id,
        billing_plan_id,
        invoice_number,
        amount_cents,
        amount_paid_cents,
        balance_due_cents,
        currency,
        due_date,
        status,
        issued_at,
        paid_at,
        period_start,
        period_end,
        created_at;
  `,
};
