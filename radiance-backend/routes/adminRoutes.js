const express = require("express");
const { checkAdmin } = require("../controllers/admin/checkAdmin");
const { getCompanies } = require("../controllers/admin/getCompanies");

const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");

const router = express.Router();

router.post("/check-admin", requireSupabaseAuth, checkAdmin);
router.get("/companies", requireSupabaseAuth, getCompanies);

module.exports = router;
