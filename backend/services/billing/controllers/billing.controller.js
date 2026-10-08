import crypto from "crypto";
import axios from "axios";
import razorpay from "../config/razorpay.js";
import { PLANS } from "../utils/plans.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { planId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User ID missing" });
    }

    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    const selectedPlan = PLANS[planId];

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
    });

    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      plan: selectedPlan.id,
      currency: order.currency,
      status: "pending",
    });

    res.status(201).json({
      order,
      plan: selectedPlan,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.log("VERIFY BODY:", req.body);
    console.log("ORDER ID:", razorpay_order_id);
    console.log("PAYMENT ID:", razorpay_payment_id);
    console.log("SIGNATURE:", razorpay_signature);

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("GENERATED:", generatedSignature);
    console.log("RECEIVED:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    if (payment.status === "completed") {
      return res.status(400).json({
        error: "Payment already verified",
      });
    }

    payment.paymentId = razorpay_payment_id;
    payment.status = "completed";

    await payment.save();

    await axios.post(`${process.env.AUTH_SERVICE}/update-plan`, {
      userId: payment.userId,
      plan: payment.plan,
      credits: payment.credits,
    });

    res.status(200).json({
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      error: "Failed to verify payment",
    });
  }
};
