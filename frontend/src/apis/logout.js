import api from "../utils/axios";

export const logout = async () => {
  try {
    await api.post("/api/auth/logout", {});
  } catch (error) {
    console.log("logout error -", error);
  }
};
