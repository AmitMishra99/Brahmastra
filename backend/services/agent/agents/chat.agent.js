import { getModels } from "../config/llmmodels.js";

export const chatAgent = async (state) => {
  const llm = await getModels("chat");
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
