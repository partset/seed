const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);

app.use(errorHandler);

module.exports = app;
