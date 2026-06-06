const express = require("express");
const router = express.Router();

const { saveEngagement } = require("../controllers/Engagement");
const { auth } = require("../middlewares/auth");

router.post("/saveEngagement", auth, saveEngagement);

module.exports = router;
