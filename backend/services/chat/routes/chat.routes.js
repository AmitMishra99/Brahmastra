import express from "express";
const chatRouter = express.Router();
import {
  createConversation,
  updateConversation,
  getConversations,
  getMessages,
  saveMessage,
} from "../controller/chat.controller.js";

chatRouter.get("/create-conversation", createConversation);
chatRouter.get("/get-conversations", getConversations);
chatRouter.get("/update-conversation", updateConversation);
chatRouter.post("/save-message", saveMessage);
chatRouter.get("/get-messages/:conversationID", getMessages);

export default chatRouter;
