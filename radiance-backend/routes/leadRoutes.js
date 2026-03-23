const express = require("express");
const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");
const { insertLead } = require("../controllers/lead/insertLead");
const { modifyLead } = require("../controllers/lead/modifyLead");
const { getAllLeads } = require("../controllers/lead/getAllLeads");
const { getLead } = require("../controllers/lead/getLead");
const { validateInsertLead } = require("../validators/lead/validateInsertLead");
const { validateModifyLead } = require("../validators/lead/validateModifyLead");

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

module.exports = router;
