const {
  getCompanyByIdService,
} = require("../../services/company/getCompanyByIdService");

const getCompanyById = async (req, res, next) => {
  try {
    const result = await getCompanyByIdService(req.params.companyId);

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCompanyById };
