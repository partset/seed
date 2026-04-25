const {
  getProjectDetailsService,
} = require("../../services/project/getProjectDetailsService");

const getProjectDetails = async (req, res, next) => {
  try {
    const result = await getProjectDetailsService(req.params.projectId);

    if (!result) {
      return res.status(404).json({
        success: false,
        data: {},
        error: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjectDetails };
