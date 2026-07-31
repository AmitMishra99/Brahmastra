const { Annotation } = require("@langChain/langgraph");

const agentState = Annotation.Root({
  prompt: Annotation(),
  aiResponse: Annotation(),
  agent: Annotation(),
});

module.exports = agentState;
