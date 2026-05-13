function validateCreateProjectBillingSetup(req, res, next) {
  const { projectId } = req.params;
  const { billingPlan, invoice } = req.body;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required.",
    });
  }

  if (!billingPlan || typeof billingPlan !== "object") {
    return res.status(400).json({
      success: false,
      message: "Billing plan is required.",
    });
  }

  if (!invoice || typeof invoice !== "object") {
    return res.status(400).json({
      success: false,
      message: "Invoice is required.",
    });
  }

  const {
    billingType,
    totalAmountCents,
    monthlyAmountCents,
    depositAmountCents,
    currency,
    startDate,
    endDate,
    status,
  } = billingPlan;

  const {
    invoiceNumber,
    amountCents,
    dueDate,
    invoiceStatus,
    periodStart,
    periodEnd,
  } = invoice;

  const validBillingTypes = ["one_time", "installments"];
  const validBillingStatuses = ["draft", "active", "paused"];
  const validInvoiceStatuses = ["draft", "unpaid"];

  if (!billingType || !validBillingTypes.includes(billingType)) {
    return res.status(400).json({
      success: false,
      message:
        "Billing type must be one_time or installments. Monthly billing is not supported yet.",
    });
  }

  if (!Number.isInteger(totalAmountCents) || totalAmountCents <= 0) {
    return res.status(400).json({
      success: false,
      message: "Total amount must be a positive integer in cents.",
    });
  }

  if (
    monthlyAmountCents !== null &&
    monthlyAmountCents !== undefined &&
    (!Number.isInteger(monthlyAmountCents) || monthlyAmountCents < 0)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Monthly amount must be null or a non-negative integer in cents.",
    });
  }

  if (
    depositAmountCents !== null &&
    depositAmountCents !== undefined &&
    (!Number.isInteger(depositAmountCents) || depositAmountCents < 0)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Deposit amount must be null or a non-negative integer in cents.",
    });
  }

  if (currency && typeof currency !== "string") {
    return res.status(400).json({
      success: false,
      message: "Currency must be a string.",
    });
  }

  if (currency && currency.length !== 3) {
    return res.status(400).json({
      success: false,
      message: "Currency must be a 3-letter currency code.",
    });
  }

  if (status && !validBillingStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Billing plan status must be draft, active, or paused.",
    });
  }

  if (!invoiceNumber || typeof invoiceNumber !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invoice number is required.",
    });
  }

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invoice amount must be a positive integer in cents.",
    });
  }

  if (amountCents > totalAmountCents) {
    return res.status(400).json({
      success: false,
      message:
        "Invoice amount cannot be greater than the total billing amount.",
    });
  }

  if (invoiceStatus && !validInvoiceStatuses.includes(invoiceStatus)) {
    return res.status(400).json({
      success: false,
      message: "Invoice status must be draft or unpaid.",
    });
  }

  req.validatedBillingSetup = {
    projectId,
    billingPlan: {
      billingType,
      totalAmountCents,
      monthlyAmountCents: monthlyAmountCents ?? null,
      depositAmountCents: depositAmountCents ?? null,
      currency: currency ? currency.toUpperCase() : "USD",
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      status: status ?? "active",
    },
    invoice: {
      invoiceNumber: invoiceNumber.trim(),
      amountCents,
      currency: currency ? currency.toUpperCase() : "USD",
      dueDate: dueDate ?? null,
      status: invoiceStatus ?? "unpaid",
      periodStart: periodStart ?? null,
      periodEnd: periodEnd ?? null,
    },
  };

  return next();
}

module.exports = {
  validateCreateProjectBillingSetup,
};
