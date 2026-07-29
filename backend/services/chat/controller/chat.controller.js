const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const mongoose = require("mongoose");

const createConversation = async (req, res) => {
  try {
    const userID = req.headers["x-user-id"];
    console.log("userID : ", userID);
    const conversation = await Conversation.create({
      userID: userID,
    });
    return res.status(200).json({ message: "conversation created" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "create conversation error - ", error });
  }
};

const getConversations = async (req, res) => {
  try {
    const userID = req.headers["x-user-id"];
    console.log("userID : ", userID);
    const conversations = await Conversation.find({
      userID: userID,
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ message: conversations });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "get conversation error - ", error });
  }
};

const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(id, {
      title,
    });
    return res.status(200).json({ message: conversation });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "update conversation error - ", error });
  }
};

const saveMessage = async (req, res) => {
  try {
    const { conversationID, role, content } = req.body;
    const message = await Message.create({
      conversationID,
      content,
      role,
    });
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({ message: `create message error - ${e}` });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationID } = req.body;
    const messages = await Message.find({
      conversationID,
    }).sort({ createdAt: -1 });
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({ message: `get messages error - ${e}` });
  }
};

module.exports = {
  createConversation,
  getConversations,
  updateConversation,
  saveMessage,
  getMessages,
};
