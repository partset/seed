const {
  modifyProjectDetailsService,
} = require("../../services/project/modifyProjectDetailsService");

const modifyProjectDetails = async (req, res, next) => {
  try {
    const result = await modifyProjectDetailsService(
      req.params.projectId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { modifyProjectDetails };
