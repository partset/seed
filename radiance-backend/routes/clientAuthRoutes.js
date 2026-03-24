// routes/clientAuthRoutes.js
const express = require("express");
const inviteClient = require("../controllers/clientAuth/inviteClient");
const validateInviteClient = require("../validators/clientAuth/validateInviteClient");
const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.post(
  "/invite",
  requireSupabaseAuth,
  requireAdmin,
  validateInviteClient,
  inviteClient,
);

module.exports = router;
