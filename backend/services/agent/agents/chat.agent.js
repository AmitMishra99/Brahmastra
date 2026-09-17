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
  You are Brahmastra, an intelligent Indian AI assistant.
  Respond using clean Markdown.
  - Be concise and directly answer the question.
  - Use headings, bullets, and numbered lists when useful.
  - Use **bold** for important points.
  - Use \`inline code\` for technical terms.
  - Use fenced code blocks with the correct language for code.
  - Use Markdown tables for comparisons.
  `;
  const messages = [new SystemMessage(systemPrompt)];

  history.forEach((msg) => {
    if (msg.role == "user") messages.push(new HumanMessage(msg.content));
    if (msg.role == "assistant") messages.push(new AIMessage(msg.content));
  });
  messages.push(new HumanMessage(state.prompt));
  
  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content,
  };
};
