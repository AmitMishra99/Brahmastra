const { ChatGroq } = require("@langchain/groq");
const { ChatGoogle } = require("@langchain/google");

const groq = new ChatGroq({
  model: "openai/gpt-oss-120b",
});

const gemini = new ChatGoogle({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
});

const getModels = async (agent) => {
  switch (agent) {
    case "groq":
      return groq;
    case "gemini":
      return gemini;
    default:
      return groq;
  }
};

exports.getModels = getModels;
