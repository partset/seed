const {
  getAllCompaniesService,
} = require("../../services/company/getAllCompaniesService");

const getAllCompanies = async (req, res, next) => {
  try {
    const result = await getAllCompaniesService();

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCompanies };
