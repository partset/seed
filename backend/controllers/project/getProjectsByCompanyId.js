const {
  getProjectsByCompanyIdService,
} = require("../../services/project/getProjectsByCompanyIdService");

const getProjectsByCompanyId = async (req, res, next) => {
  try {
    const result = await getProjectsByCompanyIdService(req.params.companyId);

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjectsByCompanyId };
