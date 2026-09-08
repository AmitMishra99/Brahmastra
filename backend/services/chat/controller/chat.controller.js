import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
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

export const getConversations = async (req, res) => {
  try {
    const userID = req.headers["x-user-id"];
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

export const updateConversation = async (req, res) => {
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

export const saveMessage = async (req, res) => {
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

export const getMessages = async (req, res) => {
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
