const axios = require("axios");
const graph = require("../graph/graph")

const agent = (req, res) => {
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
        const response = result.aiResponse;
        return res.status(200).json({ response });
  } catch (e) {
        console.error("Error in agent controller:", e);
        res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = agent;
