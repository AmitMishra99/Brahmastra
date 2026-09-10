import api from "../utils/axios";

export const getMessages = async (conversationID) => {
  try {
    const { data } = await api.get(`/api/chat/get-messages/${conversationID}`);
    return data;
  } catch (error) {
    console.log("getMessages error - ", error);
  }
};
