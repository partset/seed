const { insertLeadService } = require("../../services/lead/insertLeadService");

const insertLead = async (req, res, next) => {
  try {
    const result = await insertLeadService(req.body);

    return res.status(201).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { insertLead };
