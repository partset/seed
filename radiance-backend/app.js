const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const leadRoutes = require("./routes/leadRoutes");
const adminRoutes = require(".//routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/lead", leadRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
