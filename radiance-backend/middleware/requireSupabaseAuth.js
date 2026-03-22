const { supabaseAdmin } = require("../services/supabaseAdmin");

async function requireSupabaseAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Missing authorization token.",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Invalid authorization token.",
      });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Invalid or expired session.",
      });
    }

    req.authUserId = data.user.id;
    req.authUser = data.user;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireSupabaseAuth };
