const express = require("express");
const { checkClient } = require("../controllers/client/checkClient");

const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");

const router = express.Router();

router.post("/check-client", requireSupabaseAuth, checkClient);

module.exports = router;
