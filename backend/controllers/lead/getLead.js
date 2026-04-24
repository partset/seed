const { getLeadService } = require("../../services/lead/getLeadService");

const getLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getLeadService(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Lead not found",
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

module.exports = { getLead };
