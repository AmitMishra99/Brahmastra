const { StateGraph } = require("@langchain/langgraph");

const agentState = require("./state");
const router = require("./router");
const chatAgent = require("../agents/chat.agent");
const searchAgent = require("../agents/search.agent");
const codingAgent = require("../agents/coding.agent");
const pdfAgent = require("../agents/pdf.agent");
const pptAgent = require("../agents/ppt.agent");
const vision = require("../agents/vision");

const workFlow = new StateGraph(agentState);

workFlow.addNode("router", router);
workFlow.addNode("chat", chatAgent);
workFlow.addNode("search", searchAgent);
workFlow.addNode("coding", codingAgent);
workFlow.addNode("pdf", pdfAgent);
workFlow.addNode("ppt", pptAgent);
workFlow.addNode("vision", vision);

workFlow.addEdge("__start__", "router");

workFlow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";
      case "search":
        return "search";
      case "coding":
        return "coding";
      case "pdf":
        return "pdf";
      case "ppt":
        return "ppt";
      case "vision":
        return "vision";
      default:
        return "chat";
    }
  },
  {
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    vision: "vision",
  },
);

// Especial Case
workFlow.addEdge("search", "chat");

workFlow.addEdge("chat", "__end__");
workFlow.addEdge("coding", "__end__");
workFlow.addEdge("pdf", "__end__");
workFlow.addEdge("ppt", "__end__");
workFlow.addEdge("vision", "__end__");

const graph = workFlow.compile();

module.exports = graph;
