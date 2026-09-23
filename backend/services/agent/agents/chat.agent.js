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
Give only relevant information.
Use Markdown when useful.
Never invent information.

If web search results are provided, use them to answer the current query.
`;

  const messages = [new SystemMessage(systemPrompt)];

  history.forEach((msg) => {
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    }

    if (msg.role === "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  });

  if (state.searchResults?.length > 0) {
    messages.push(
      new SystemMessage(`
WEB SEARCH RESULTS:
${JSON.stringify(state.searchResults, null, 2)}

Use these results when answering the user's current query.
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
