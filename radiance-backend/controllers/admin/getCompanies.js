const { getCompaniesService } = require("../../services/admin/getCompaniesService");

const getCompanies = async (req, res, next) => {
  try {
    const result = await getCompaniesService();

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCompanies };
