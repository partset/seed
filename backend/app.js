const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const leadRoutes = require("./routes/leadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const utilRoutes = require("./routes/utilRoutes");
const companyRoutes = require("./routes/companyRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/lead", leadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/util", utilRoutes);

app.use(errorHandler);

module.exports = app;
