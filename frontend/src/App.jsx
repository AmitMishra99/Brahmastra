import { useEffect, useState } from "react";
import Home from "./pages/Home";
import getCurrentUser from "./apis/getCurrentUser";
import { setUserData } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        dispatch(setUserData(data));
      } catch (error) {
        console.log("Auth restore error:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Home />
    </div>
  );
};

export default App;