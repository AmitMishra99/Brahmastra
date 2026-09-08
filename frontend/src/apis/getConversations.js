import api from "../utils/axios";

export const getConversations = async () => {
  try {
    const { data } = await api.get("/api/chat/get-conversations");
    return data.message;
  } catch (error) {
    console.log("getConversations error - ", error);
  }
};
