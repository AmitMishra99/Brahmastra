import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversation = await Conversation.create({
      userId: userId,
    });
    return res
      .status(200)
      .json({ message: `conversation created - ${conversation}` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "create conversation error - ", error });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const conversations = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ message: conversations });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "get conversation error - ", error });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    if (!conversationId)
      return res.status(500).json({ message: "conversationId not found !!" });
    const message = await Message.create({
      conversationId,
      content,
      role,
    });
    return res.status(200).json(message);
  } catch (e) {
    return res.status(500).json({ message: `save message error - ${e}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messages);
  } catch (e) {
    return res.status(500).json({ message: `get messages error - ${e}` });
  }
};

export const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId, title } = req.body;
    const updatedTiltle = await Conversation.findByIdAndUpdate(conversationId, {
      title,
    });
    return res.status(200).json({ message: updatedTiltle });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "update conversation title error - ", error });
  }
};
