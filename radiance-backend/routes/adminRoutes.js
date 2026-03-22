const express = require("express");
const { checkAdmin } = require("../controllers/admin/checkAdmin");

const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");

const router = express.Router();

router.post("/check-admin", requireSupabaseAuth, checkAdmin);

module.exports = router;
