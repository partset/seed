const {
  getAllLeadsService,
} = require("../../services/lead/getAllLeadsService");

const getAllLeads = async (req, res, next) => {
  try {
    const result = await getAllLeadsService();

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllLeads };
