const {
  insertProjectMilestoneService,
} = require("../../services/project/insertProjectMilestoneService");

const insertProjectMilestone = async (req, res, next) => {
  try {
    const result = await insertProjectMilestoneService(req.body);

    return res.status(201).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { insertProjectMilestone };
