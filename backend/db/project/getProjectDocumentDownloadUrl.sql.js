module.exports = {
  getProjectDocumentById: `
    SELECT
      id,
      project_id AS "projectId",
      file_url AS "filePath",
      file_name AS "fileName"
    FROM project_documents
    WHERE id = $1
      AND project_id = $2
    LIMIT 1;
  `,
};
