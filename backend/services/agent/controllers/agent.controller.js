import axios from "axios";
import graph from "../graph/graph.js";
import { addMessages } from "../config/memory.js";
import redis from "../../../shared/redis/redis.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationID } = req.body;

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationID,
      content: prompt,
      role: "user",
    });

    const result = await graph.invoke({
      prompt,
      conversationID,
    });

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationID,
      content: result.aiResponse,
      role: "assistant",
    });

    await addMessages(conversationID, "user", prompt);
    await addMessages(conversationID, "assistant", result.aiResponse);

    return res.status(200).json({
      response: result.aiResponse,
    });
  } catch (e) {
    console.error("Error in agent controller:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
