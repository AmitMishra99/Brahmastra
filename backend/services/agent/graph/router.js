const getModels = require("../config/llmModels");

const router = async (state) => {
  const llm = getModels("router");
  const prompt = `You are a router agent that receives a user query and decides which agent is best suited to handle the request. The available agents are: chat, search, coding, pdf, ppt, and vision. Based on the user's query, determine the most appropriate agent to handle the request. Respond with only the name of the selected agent. 
  
  User Query: ${state.prompt}`;

  const response = await llm.invoke(prompt);
  console.log("Router Agent Response:", response);
  return {
    ...state,
    agent: response.text.trim().toLowerCase(),
  };
};
module.exports = router;
