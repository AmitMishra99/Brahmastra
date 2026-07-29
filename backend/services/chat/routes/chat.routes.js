const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversations,
  updateConversation,
  saveMessage,
  getMessages,
} = require("../controller/chat.controller");

router.get("/create-conversation", createConversation);
router.get("/get-conversations", getConversations);
router.get("/update-conversation", updateConversation);
router.get("save-message", saveMessage);
router.get("/get-messages/:conversationId", getMessages);

module.exports = router;
