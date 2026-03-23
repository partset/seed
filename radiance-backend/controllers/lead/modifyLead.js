const { modifyLeadService } = require("../../services/lead/modifyLeadService");

const modifyLead = async (req, res, next) => {
  try {
    const result = await modifyLeadService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { modifyLead };
