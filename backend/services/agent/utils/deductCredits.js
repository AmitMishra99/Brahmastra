import axios from "axios";

export const deductCredits = async (userId, agent) => {
  try {
    const data = axios.post(`${process.env.AUTH_SERVICE}/deduct-credits`, {
      userId,
      agent,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log("deduct Credits:", error);
  }
};
