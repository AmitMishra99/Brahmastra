import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import { FcGoogle } from "react-icons/fc";

const Home = () => {
  const handleLogin = async (token) => {
    try {
      const data = await api.post("/api/auth/login", { token });
      console.log("handleLogin", data.data);
    } catch (e) {
      console.log("handleLogin Error- ", e);
    }
  };

  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      console.log("Google Loign Error - ", error);
    }
  };
  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] font-semibold text-slate-100  tracking-tight">
              Welcome to Brahmastra
            </h2>
            <p className="text-[13px] text-slate-500 ">
              Please login to continue using the app.
            </p>
          </div>
          <button
            className="w-full flex items-center justify-center gap-3 py-[11px] rounded-x1 text-sm font-medium text-black/90 bg-white hover:bg-gray-200 transition-all duration-150cursor-pointer"
            onClick={googleLogin}
          >
            <FcGoogle size={16} /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
