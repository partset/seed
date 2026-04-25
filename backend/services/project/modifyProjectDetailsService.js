const db = require("../dbClient");
const modifyProjectDetailsQuery = require("../../db/project/modifyProjectDetails.sql");

function formatDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return value;
}

function wasFieldSent(updates, fieldName) {
  return Object.prototype.hasOwnProperty.call(updates, fieldName);
}

function normalizeNullableString(value) {
  if (value === null) return null;
  return value.trim();
}

function normalizeProjectDetailsUpdates(updates) {
  return {
    nameWasSent: wasFieldSent(updates, "name"),
    name: updates.name !== undefined ? updates.name.trim() : null,

    currentPhaseWasSent: wasFieldSent(updates, "currentPhase"),
    currentPhase:
      updates.currentPhase !== undefined
        ? normalizeNullableString(updates.currentPhase)
        : null,

    nextStepWasSent: wasFieldSent(updates, "nextStep"),
    nextStep:
      updates.nextStep !== undefined
        ? normalizeNullableString(updates.nextStep)
        : null,

    startDateWasSent: wasFieldSent(updates, "startDate"),
    startDate: updates.startDate !== undefined ? updates.startDate : null,

    statusWasSent: wasFieldSent(updates, "status"),
    status:
      updates.status !== undefined ? updates.status.trim().toLowerCase() : null,

    targetLaunchDateWasSent: wasFieldSent(updates, "targetLaunchDate"),
    targetLaunchDate:
      updates.targetLaunchDate !== undefined ? updates.targetLaunchDate : null,

    clientVisibleSummaryWasSent: wasFieldSent(updates, "clientVisibleSummary"),
    clientVisibleSummary:
      updates.clientVisibleSummary !== undefined
        ? normalizeNullableString(updates.clientVisibleSummary)
        : null,
  };
}

async function modifyProjectDetailsService(projectId, updates) {
  const normalizedUpdates = normalizeProjectDetailsUpdates(updates);

  const result = await db.query(
    modifyProjectDetailsQuery.modifyProjectDetails,
    [
      projectId,

      normalizedUpdates.nameWasSent,
      normalizedUpdates.name,

      normalizedUpdates.currentPhaseWasSent,
      normalizedUpdates.currentPhase,

      normalizedUpdates.nextStepWasSent,
      normalizedUpdates.nextStep,

      normalizedUpdates.startDateWasSent,
      normalizedUpdates.startDate,

      normalizedUpdates.statusWasSent,
      normalizedUpdates.status,

      normalizedUpdates.targetLaunchDateWasSent,
      normalizedUpdates.targetLaunchDate,

      normalizedUpdates.clientVisibleSummaryWasSent,
      normalizedUpdates.clientVisibleSummary,
    ],
  );

  if (result.rows.length === 0) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    currentPhase: row.current_phase,
    nextStep: row.next_step,
    startDate: formatDateOnly(row.start_date),
    status: row.status,
    targetLaunchDate: formatDateOnly(row.target_launch_date),
    clientVisibleSummary: row.client_visible_summary,
  };
}

module.exports = { modifyProjectDetailsService };
