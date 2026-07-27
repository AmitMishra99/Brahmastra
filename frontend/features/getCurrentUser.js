import api from "../src/utils/axios";

const getCurrentUser = async () => {
  try {
    const data = await api.get("/api/me");
    return data.data;
  } catch (error) {
    console.log(`getCurrentUser Error - ${error}`);
    return null;
  }
};

export default getCurrentUser;
