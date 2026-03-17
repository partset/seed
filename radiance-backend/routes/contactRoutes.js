const express = require("express");
const { insertContact } = require("../controllers/contact/insertContact");
const {
  validateInsertContact,
} = require("../validators/contact/validateInsertContact");

const router = express.Router();

router.post("/insert", validateInsertContact, insertContact);

module.exports = router;
