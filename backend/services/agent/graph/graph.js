import { StateGraph } from "@langchain/langgraph";
import agentState from "./state.js";

import { routerAgent } from "../agents/router.agent.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { imageAgent } from "../agents/image.agent.js";

const workFlow = new StateGraph(agentState);

workFlow.addNode("router", routerAgent);
workFlow.addNode("chat", chatAgent);
workFlow.addNode("search", searchAgent);
workFlow.addNode("coding", codingAgent);
workFlow.addNode("pdf", pdfAgent);
workFlow.addNode("ppt", pptAgent);
workFlow.addNode("image", imageAgent);

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
      case "image":
        return "image";
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
    image: "image",
  },
);

// Especial Case
workFlow.addEdge("search", "chat");

workFlow.addEdge("chat", "__end__");
workFlow.addEdge("coding", "__end__");
workFlow.addEdge("pdf", "__end__");
workFlow.addEdge("ppt", "__end__");
workFlow.addEdge("image", "__end__");

const graph = workFlow.compile();
export default graph;
