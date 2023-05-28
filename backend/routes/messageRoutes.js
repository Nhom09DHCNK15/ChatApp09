const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, upload.array("file"), sendMessage);

module.exports = router;
