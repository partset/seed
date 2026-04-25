const {
  insertProjectUpdateService,
} = require("../../services/project/insertProjectUpdateService");

const insertProjectUpdate = async (req, res, next) => {
  try {
    const result = await insertProjectUpdateService(req.body);

    return res.status(201).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { insertProjectUpdate };
