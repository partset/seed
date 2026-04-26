const {
  getProjectDocumentDownloadUrlService,
} = require("../../services/project/getProjectDocumentDownloadUrlService");

async function getProjectDocumentDownloadUrl(req, res) {
  try {
    const { projectId, documentId } = req.params;

    const downloadData = await getProjectDocumentDownloadUrlService({
      projectId,
      documentId,
    });

    return res.status(200).json({
      success: true,
      data: downloadData,
      error: "",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      data: {},
      error: error.message || "Failed to create document download link.",
    });
  }
}

module.exports = { getProjectDocumentDownloadUrl };
