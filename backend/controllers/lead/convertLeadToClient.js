const {
  convertLeadToClientService,
} = require("../../services/lead/convertLeadToClientService");

const convertLeadToClient = async (req, res, next) => {
  try {
    const result = await convertLeadToClientService({
      leadId: req.params.id,
      companyName: req.body.companyName,
      email: req.body.email,
      phone: req.body.phone,
      projectType: req.body.projectType,
      projectName: req.body.projectName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    return res.status(201).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { convertLeadToClient };
