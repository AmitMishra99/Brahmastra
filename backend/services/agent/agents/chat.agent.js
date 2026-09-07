const { getModels } = require("../config/llmModels");

const chatAgent = async (state) => {
  const llm = await getModels("chat");
  const systemPrompt = "You are Brahmastra, An Indian AI assistant ";
  const response = await llm.invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "human",
      content: state.prompt,
    },
  ]);
  return {
    ...state,
    aiResponse: response.content,
  };
};
module.exports = chatAgent;
