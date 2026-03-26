const { supabase } = require("../supabaseClient");

async function getAccessTokenService()
{
  const email = process.env.TEST_ADMIN_EMAIL;
  const password = process.env.TEST_ADMIN_PASSWORD;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error signing in admin:", error);
    throw new Error("Failed to sign in test admin");
  }

  if (!data.session) {
    throw new Error("No session returned");
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  };
}

module.exports = { getAccessTokenService };