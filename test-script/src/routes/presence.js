const express = require("express");
const authenticateToken = require("../middleware/auth");
const { create, update, getData } = require("../controllers/PresenceController");
const router = express.Router();

router.post("/create", authenticateToken, create);
router.post("/update/:id", authenticateToken, update);
router.get("/getData", authenticateToken, getData);

module.exports = router;
