const express = require("express");
const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");
const { insertLead } = require("../controllers/lead/insertLead");
const { modifyLead } = require("../controllers/lead/modifyLead");
const { getAllLeads } = require("../controllers/lead/getAllLeads");
const { getLead } = require("../controllers/lead/getLead");
const {
  convertLeadToClient,
} = require("../controllers/lead/convertLeadToClient");
const { validateInsertLead } = require("../validators/lead/validateInsertLead");
const { validateModifyLead } = require("../validators/lead/validateModifyLead");
const {
  validateConvertLeadToClient,
} = require("../validators/lead/validateConvertLeadToClient");

const router = express.Router();

router.post("/insert", validateInsertLead, insertLead);
router.get("/", requireSupabaseAuth, requireAdmin, getAllLeads);
router.get("/:id", requireSupabaseAuth, requireAdmin, getLead);
router.put(
  "/:id",
  requireSupabaseAuth,
  requireAdmin,
  validateModifyLead,
  modifyLead,
);
router.post(
  "/:id/convert-to-client",
  requireSupabaseAuth,
  requireAdmin,
  validateConvertLeadToClient,
  convertLeadToClient,
);

module.exports = router;
