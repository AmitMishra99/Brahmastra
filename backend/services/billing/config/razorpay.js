import raz from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new raz({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
