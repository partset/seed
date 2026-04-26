const insertProjectDocumentService = require("../../services/project/insertProjectDocumentService");

async function insertProjectDocument(req, res) {
  try {
    const insertedDocument = await insertProjectDocumentService({
      projectId: req.body.projectId,
      authUserId: req.authUserId,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      isVisibleToClient: req.body.isVisibleToClient,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      data: insertedDocument,
      error: "",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      data: {},
      error: error.message || "Failed to upload project document.",
    });
  }
}

module.exports = { insertProjectDocument };
