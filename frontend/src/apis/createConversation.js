import api from "../utils/axios";

export const createConversation = async () => {
  try {
    const { data } = await api.get("/api/chat/create-conversation");
    return data.message;
  } catch (error) {
    console.log("createConversation error - ", error);
  }
};
