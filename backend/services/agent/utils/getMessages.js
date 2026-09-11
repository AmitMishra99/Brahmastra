import axios from "axios";

export const getMessages = async (coversationID) => {
  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE}/get-messages/${coversationID}`,
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log("getMessages backend chat -", error);
    return null;
  }
};
