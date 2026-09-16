import api from "../utils/axios";

export const createConversation = async () => {
  try {
    const data = await api.post("/api/chat/create-conversation", {});
    return data.data.message;
  } catch (error) {
    console.log("createConversation error - ", error);
  }
};
