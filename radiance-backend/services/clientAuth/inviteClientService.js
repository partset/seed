// services/clientAuth/inviteClientService.js
const supabaseAdmin = require("./supabaseAdminClient");

async function inviteClientService({ email, redirectTo }) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    normalizedEmail,
    {
      redirectTo,
    },
  );

  if (error) {
    const err = new Error(error.message || "Failed to invite client");
    err.statusCode = 400;
    throw err;
  }

  return data;
}

module.exports = inviteClientService;
