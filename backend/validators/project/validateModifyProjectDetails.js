const allowedStatuses = [
  "planned",
  "active",
  "on_hold",
  "completed",
  "cancelled",
];

const allowedFields = [
  "name",
  "currentPhase",
  "nextStep",
  "startDate",
  "status",
  "targetLaunchDate",
  "clientVisibleSummary",
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidDateOnly(value) {
  if (typeof value !== "string") return false;

  // Requires YYYY-MM-DD format.
  const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateOnlyRegex.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) return false;

  const [year, month, day] = value.split("-").map(Number);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

function validateStringField(value, fieldName, options = {}) {
  const {
    allowNull = false,
    requiredNonEmpty = false,
    maxLength = 255,
  } = options;

  if (value === null) {
    if (allowNull) return null;
    return `${fieldName} cannot be null`;
  }

  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  const trimmedValue = value.trim();

  if (requiredNonEmpty && trimmedValue.length === 0) {
    return `${fieldName} cannot be empty`;
  }

  if (trimmedValue.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or less`;
  }

  return null;
}

function validateModifyProjectDetails(req, res, next) {
  const { projectId } = req.params;
  const updates = req.body;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Project id is required",
    });
  }

  if (!isPlainObject(updates)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Request body must be an object",
    });
  }

  const sentFields = Object.keys(updates);

  const unknownFields = sentFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (unknownFields.length > 0) {
    return res.status(400).json({
      success: false,
      data: {},
      error: `Unknown field(s): ${unknownFields.join(", ")}`,
    });
  }

  const hasAtLeastOneField = allowedFields.some(
    (field) => updates[field] !== undefined,
  );

  if (!hasAtLeastOneField) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "At least one field is required to update the project details",
    });
  }

  if (updates.name !== undefined) {
    const error = validateStringField(updates.name, "name", {
      allowNull: false,
      requiredNonEmpty: true,
      maxLength: 255,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        data: {},
        error,
      });
    }
  }

  if (updates.currentPhase !== undefined) {
    const error = validateStringField(updates.currentPhase, "currentPhase", {
      allowNull: true,
      requiredNonEmpty: false,
      maxLength: 255,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        data: {},
        error,
      });
    }
  }

  if (updates.nextStep !== undefined) {
    const error = validateStringField(updates.nextStep, "nextStep", {
      allowNull: true,
      requiredNonEmpty: false,
      maxLength: 255,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        data: {},
        error,
      });
    }
  }

  if (updates.clientVisibleSummary !== undefined) {
    const error = validateStringField(
      updates.clientVisibleSummary,
      "clientVisibleSummary",
      {
        allowNull: true,
        requiredNonEmpty: false,
        maxLength: 2000,
      },
    );

    if (error) {
      return res.status(400).json({
        success: false,
        data: {},
        error,
      });
    }
  }

  if (updates.status !== undefined) {
    if (updates.status === null) {
      return res.status(400).json({
        success: false,
        data: {},
        error: "status cannot be null",
      });
    }

    if (typeof updates.status !== "string") {
      return res.status(400).json({
        success: false,
        data: {},
        error: "status must be a string",
      });
    }

    const normalizedStatus = updates.status.trim().toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        data: {},
        error: `Invalid project status. Allowed statuses are: ${allowedStatuses.join(", ")}`,
      });
    }
  }

  if (updates.startDate !== undefined) {
    if (updates.startDate !== null && !isValidDateOnly(updates.startDate)) {
      return res.status(400).json({
        success: false,
        data: {},
        error: "startDate must be a valid date in YYYY-MM-DD format or null",
      });
    }
  }

  if (updates.targetLaunchDate !== undefined) {
    if (
      updates.targetLaunchDate !== null &&
      !isValidDateOnly(updates.targetLaunchDate)
    ) {
      return res.status(400).json({
        success: false,
        data: {},
        error:
          "targetLaunchDate must be a valid date in YYYY-MM-DD format or null",
      });
    }
  }

  next();
}

module.exports = { validateModifyProjectDetails };
