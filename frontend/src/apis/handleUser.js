import api from "../utils/axios";

const handleUser = async () => {
  try {
    const data = await api.get("/api/me");
    return data.data;
  } catch (error) {
    console.log("handleUser Error -", error);
    return null;
  }
};

export default handleUser;
