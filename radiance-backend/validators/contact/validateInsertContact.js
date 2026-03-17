function validateInsertContact(req, res, next) {
  const {
    firstName,
    lastName,
    email,
    phone,
    companyName,
    projectType,
    message,
  } = req.body;

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

  if (!companyName?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Company Name",
    });
  }

  if (!projectType?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Project Type",
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
