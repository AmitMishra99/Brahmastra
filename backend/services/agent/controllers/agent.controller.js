import axios from "axios";
import graph from "../langGraph/graph.js";
import { addMessages } from "../config/memory.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const userId = req.headers["x-user-id"];

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      userId,
    });

    const response = result.aiResponse;

    await addMessages(conversationId, "user", prompt);
    await addMessages(conversationId, "assistant", response);

    await axios.post(`${process.env.CHAT_SERVICE}/create-message`, {
      conversationId,
      role: "user",
      content: prompt,
      agent: result.agent,
    });

    await axios.post(`${process.env.CHAT_SERVICE}/create-message`, {
      conversationId,
      role: "assistant",
      content: response,
      images: result.images,
      agent: result.agent,
    });

    return res.status(200).json({
      response: result.aiResponse,
      images: result.images,
      agent: result.agent,
    });
  } catch (e) {
    console.error("Error in agent controller:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
