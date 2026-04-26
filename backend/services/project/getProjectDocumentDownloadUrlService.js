const db = require("../dbClient");
const { supabaseAdmin } = require("../../services/supabaseAdmin");
const {
  getProjectDocumentById,
} = require("../../db/project/getProjectDocumentDownloadUrl.sql");

const PROJECT_DOCUMENT_BUCKET =
  process.env.SUPABASE_PROJECT_DOCUMENT_BUCKET || "project-documents";

async function getProjectDocumentDownloadUrlService({ projectId, documentId }) {
  const documentResult = await db.query(getProjectDocumentById, [
    documentId,
    projectId,
  ]);

  if (documentResult.rows.length === 0) {
    const error = new Error("Document not found.");
    error.statusCode = 404;
    throw error;
  }

  const document = documentResult.rows[0];

  const signedUrlResult = await supabaseAdmin.storage
    .from(PROJECT_DOCUMENT_BUCKET)
    .createSignedUrl(document.filePath, 60 * 5);

  if (signedUrlResult.error) {
    const error = new Error("Failed to create document download link.");
    error.statusCode = 500;
    throw error;
  }

  return {
    url: signedUrlResult.data.signedUrl,
    expiresInSeconds: 60 * 5,
    fileName: document.fileName,
  };
}

module.exports = { getProjectDocumentDownloadUrlService };
