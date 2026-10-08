import api from "../utils/axios";

export const verifyPayment = async (res) => {
  try {
    const { data } = await api.post("/api/billing/verify-payment", res);
    console.log("Verify payment response:", data);
    return data;
  } catch (err) {
    console.log(
      "Frontend - verify payment API error:",
      err.response?.data || err,
    );

    throw err;
  }
};
