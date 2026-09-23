import api from "../utils/axios";

export const getAgent = async (conversationId) => {
  try {
    const { data } = await api.post("/api/agent/get-agent", { conversationId });
    return data?.data;
  } catch (err) {
    console.log("Frontend - Error through getAgent Api ", err);
  }
};
