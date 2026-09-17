import api from "../utils/axios";

export const updateConversationTitle = async (payload) => {
  try {
    const data = await api.patch(
      "/api/chat/update-conversation-title",
      payload,
    );
    console.log(data.data);
    return data.data;
  } catch (e) {
    console.log("updateConversation error - ", e);
  }
};
