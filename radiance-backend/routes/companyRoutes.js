const express = require("express");
const { getAllCompanies } = require("../controllers/company/getAllCompanies");

const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.get("/all", requireSupabaseAuth, requireAdmin, getAllCompanies);

module.exports = router;
