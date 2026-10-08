import api from "../utils/axios";

export const createOrder = async (planId) => {
  try {
    const { data } = await api.post("/api/billing/create-order", { planId });
    console.log(data);
    return data;
  } catch (err) {
    console.log("frontend - api - error", err);
    return [];
  }
};
