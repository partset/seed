const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require(".//routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
