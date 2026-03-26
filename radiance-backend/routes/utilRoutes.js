const express = require("express");
const { getAccessToken } = require("../controllers/util/getAccessToken");

const router = express.Router();

router.get("/get-access-token", getAccessToken);

module.exports = router;
