const {
  insertContactService,
} = require("../../services/contact/insertContactService");

const insertContact = async (req, res, next) => {
  try {
    const result = await insertContactService(req.body);

    return res.status(201).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { insertContact };
