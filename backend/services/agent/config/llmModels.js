import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";

const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
});

const gemini = new ChatGoogle({
  model: "gemini-2.5-flash",
});

export const getModels = async (agent) => {
  switch (agent) {
    case "chat":
      return groq;
    case "search":
      return groq;
    case "coding":
      return gemini;
    case "search":
      return groq;
    default:
      return groq;
  }
};
