function validateProjectDocumentDownloadUrl(req, res, next) {
  const { projectId, documentId } = req.params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!projectId?.trim() || !uuidRegex.test(projectId)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
  }

  if (!documentId?.trim() || !uuidRegex.test(documentId)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Document ID",
    });
  }

  next();
}

module.exports = { validateProjectDocumentDownloadUrl };
