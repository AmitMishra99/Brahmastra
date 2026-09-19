import { getModel } from "../config/llmModels.js";

export const routerAgent = async (state) => {
  try {
    if (state.agent && state.agent !== "auto") {
      return {
        ...state,
        agent: state.agent,
      };
    }

    const llm = getModel("router");

    const prompt = `You are a router agent that receives a user query and decides which agent is best suited to handle the request. The available agents are: chat, search, coding, pdf, ppt, and image. Based on the user's query, determine the most appropriate agent to handle the request. Respond with only the name of the selected agent. 
    User Query: ${state.prompt}`;

    const response = await llm.invoke(prompt);

    return {
      ...state,
      agent: response.content.trim().toLowerCase(),
    };
  } catch (e) {
    console.log("Router Agent err - ", e);
  }
};
