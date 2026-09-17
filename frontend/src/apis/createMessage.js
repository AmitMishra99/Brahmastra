import api from "../utils/axios";

export const createMessage = async (payload) => {
  try {
    const data = await api.post("/api/agent/chat", payload);
    return data.data;
  } catch (error) {
    console.log("send Message error -", error);
  }
};
