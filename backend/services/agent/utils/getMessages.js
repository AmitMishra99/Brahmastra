import axios from "axios";

export const getMessages = async (coversationId) => {
  try {
    const data = await axios.get(
      `${process.env.CHAT_SERVICE}/get-messages/${coversationId}`,
    );
    return data.data;
  } catch (error) {
    console.log("getMessages backend chat -", error);
    return null;
  }
};
