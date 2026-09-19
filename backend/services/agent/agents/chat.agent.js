import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  const llm = getModel("chat");
  const history = await getMemory(state.conversationId);

  const systemPrompt = `
      You are Brahmastra, a helpful AI assistant.
      Answer directly, accurately, and concisely.
      Give only relevant information. No unnecessary details, repetition, or follow-up questions.
      Use Markdown when useful. Never invent information.
      Use provided web search results for current information. If insufficient, say so.
`;
  const messages = [new SystemMessage(systemPrompt)];
  history.forEach((msg) => {
    if (msg.role == "user") messages.push(new HumanMessage(msg.content));
    if (msg.role == "assistant") messages.push(new AIMessage(msg.content));
  });

  if (state.searchResults?.length > 0) {
    messages.push(
      new SystemMessage(`
        REAL-TIME WEB SEARCH RESULTS:

        ${JSON.stringify(state.searchResults, null, 2)}

        Use these results to answer the user's current question.
      `),
    );
  }
  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content,
  };
};
