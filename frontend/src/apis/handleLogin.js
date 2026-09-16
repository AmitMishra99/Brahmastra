import api from "../utils/axios";

export const handleLogin = async (token) => {
  try {
    const data = await api.post("/api/auth/login", { token });
    return data.data;
  } catch (error) {
    console.log("handleLogin Error- ", error);
  }
};
