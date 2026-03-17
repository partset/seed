function validateInsertContact(req, res, next) {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid First Name",
    });
  }

  if (!lastName?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Last Name",
    });
  }

  if (!email?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Email",
    });
  }

  const cleanedPhone = String(phone || "").replace(/\D/g, "");
  if (cleanedPhone.length !== 10) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Phone Number",
    });
  }

  if (!message?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Message",
    });
  }

  req.body.phone = cleanedPhone;
  next();
}

module.exports = { validateInsertContact };
