const path = require("path");
const db = require("../dbClient");
const { supabaseAdmin } = require("../../services/supabaseAdmin");
const {
  insertProjectDocument,
  getAdminByAuthUserId,
  getProjectById,
} = require("../../db/project/insertProjectDocument.sql");

const PROJECT_DOCUMENT_BUCKET =
  process.env.SUPABASE_PROJECT_DOCUMENT_BUCKET || "project-documents";

function getSafeFileName(originalName) {
  const extension = path.extname(originalName);
  const baseName = path
    .basename(originalName, extension)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  return `${baseName || "document"}-${Date.now()}${extension}`;
}

function getFileType(file) {
  const extension = path.extname(file.originalname).replace(".", "");

  if (extension) {
    return extension.toLowerCase();
  }

  return file.mimetype;
}

function parseBoolean(value) {
  return value === true || value === "true";
}

async function insertProjectDocumentService({
  projectId,
  authUserId,
  title,
  category,
  description,
  isVisibleToClient,
  file,
}) {
  const projectResult = await db.query(getProjectById, [projectId]);

  if (projectResult.rows.length === 0) {
    const error = new Error("Project not found.");
    error.statusCode = 404;
    throw error;
  }

  const adminResult = await db.query(getAdminByAuthUserId, [authUserId]);

  if (adminResult.rows.length === 0) {
    const error = new Error("Active admin user not found.");
    error.statusCode = 403;
    throw error;
  }

  const admin = adminResult.rows[0];

  const safeFileName = getSafeFileName(file.originalname);
  const storagePath = `projects/${projectId}/${safeFileName}`;

  const uploadResult = await supabaseAdmin.storage
    .from(PROJECT_DOCUMENT_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadResult.error) {
    const error = new Error("Failed to upload document file.");
    error.statusCode = 500;
    throw error;
  }

  const documentResult = await db.query(insertProjectDocument, [
    projectId,
    title.trim(),
    category?.trim() || null,
    description?.trim() || null,
    file.originalname,
    getFileType(file),
    storagePath, // private storage path, not public URL
    file.size,
    parseBoolean(isVisibleToClient),
    admin.id,
  ]);

  const document = documentResult.rows[0];

  return {
    ...document,
    uploadedByAdminName: admin.email,
  };
}

module.exports = insertProjectDocumentService;
