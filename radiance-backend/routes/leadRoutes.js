const express = require("express");
const { insertLead } = require("../controllers/lead/insertLead");
const { validateInsertLead } = require("../validators/lead/validateInsertLead");

const router = express.Router();

router.post("/insert", validateInsertLead, insertLead);

module.exports = router;
