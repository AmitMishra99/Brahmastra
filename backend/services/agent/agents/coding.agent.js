import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  const codingModel = getModel("coding");

  const prompt = `
        You are Brahmastra's Coding Agent.

        Handle only coding/software-development tasks:
        - Code generation
        - Debugging
        - Explanation
        - Review
        - Optimization
        - DSA
        - Frontend/backend
        - APIs, databases, Git, frameworks

        If coding-related, solve the request directly.

        If not coding-related, reply:
        "Sorry, I can help with coding tasks like code generation, debugging, explanation, review, and optimization. You can use our other specialized agents for other tasks."

        Do not return JSON or expose internal agent logic.

        User Request:
        ${state.prompt}
  `;

  try {
    const response = await codingModel.invoke(prompt);

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.error("Coding agent error:", error);

    return {
      ...state,
      aiResponse:
        "Sorry, I couldn't process the coding request. Please try again.",
    };
  }
};
