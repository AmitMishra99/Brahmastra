import axios from "axios";
import graph from "../graph/graph.js";

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

    return res.status(200).json({
      response: result.aiResponse,
    });
  } catch (e) {
    console.error("Error in agent controller:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
