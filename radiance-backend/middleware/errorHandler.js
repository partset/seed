function errorHandler(err, req, res, next) {
  console.error("Unhandled backend error:", err);

  return res.status(err.statusCode || 500).json({
    success: false,
    data: {},
    error: "Something went wrong",
  });
}

module.exports = { errorHandler };
