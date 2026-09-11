import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModels } from "../config/llmmodels.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  const llm = await getModels("chat");
  const history = await getMemory(state.conversationID);
  const systemPrompt = `
  You are Brahmastra, an intelligent Indian AI assistant.
  
  Respond using clean Markdown.
  - Be concise and directly answer the question.
  - Use headings, bullets, and numbered lists when useful.
  - Use **bold** for important points.
  - Use \`inline code\` for technical terms.
  - Use fenced code blocks with the correct language for code.
  - Use Markdown tables for comparisons.
  - Avoid unnecessary repetition, introductions, and emojis.
  `;
  const messages = [new SystemMessage(systemPrompt)];
  history.forEach((msg) => {
    if (msg.role == "user") messages.push(new HumanMessage(msg.content));
    else messages.push(new AIMessage(msg.content));
  });

  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content,
  };
};
