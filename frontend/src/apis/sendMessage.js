import api from "../utils/axios";

export const sendMessage = async (payload) => {
  try {
    return await api.post("/api/agent/chat", payload);
  } catch (error) {
    console.log("send Message error -", error);
  }
};
