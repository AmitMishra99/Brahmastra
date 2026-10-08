import { Crown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSelector } from "react-redux";
import { createOrder } from "../apis/createOrder";
import { verifyPayment } from "../apis/verifyPayment";

const BillingDrawer = ({ open, onClose }) => {
  const { userData } = useSelector((state) => state.user);

  const handleUpgrade = async (planId) => {
    try {
      const data = await createOrder(planId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Brahmastra AI",
        description: `${data.plan.name} Plan`,
        order_id: data.order.id,

        handler: async (res) => {
          try {
            const data = await verifyPayment(res);
            console.log("Payment verified:", data);
          } catch (err) {
            console.log("Verify handler issue:", err);
          }
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log("Handle upgrade frontend error:", err);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[380px] flex-col border-l border-white/10 bg-[#0f1117] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <div className="text-lg font-semibold text-white">Billing</div>
                <div className="text-sm text-slate-400">Plan & Credits</div>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Current Plan</p>
                    <h3 className="text-white">{userData?.plan || "free"}</h3>
                  </div>

                  <Crown size={18} className="text-yellow-400" />
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-slate-400">
                    <span>Credits</span>
                    <span>
                      {userData?.credits || 0}/{userData?.totalCredits || 100}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((userData?.credits || 0) /
                            (userData?.totalCredits || 1)) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-auto px-5">
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="font-semibold text-white">Starter Plan</h3>

                <p className="mt-2 text-2xl font-bold text-indigo-400">₹199</p>

                <p className="mt-1 text-sm text-slate-400">500 Credits</p>

                <button
                  onClick={() => handleUpgrade("starter")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                >
                  Upgrade
                </button>
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="font-semibold text-white">Pro Plan</h3>

                <p className="mt-2 text-2xl font-bold text-indigo-400">₹499</p>

                <p className="mt-1 text-sm text-slate-400">1000 Credits</p>

                <button
                  onClick={() => handleUpgrade("pro")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BillingDrawer;
