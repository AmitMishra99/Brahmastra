import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import { PLANS } from "../utils/plans.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { planId } = req.body;
    const selectedPlan = PLANS[planId];

    // Validate the planId
    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100, // Amount in paise
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

    res.status(201).json({ order, plan: selectedPlan });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_orderId, razorpay_paymentId, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_orderId}|${razorpay_paymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_orderId,
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    payment.paymentId = razorpay_paymentId;
    payment.status = "completed";
    await payment.save();

    await axios.post(`${process.env.AUTH_SERVICE}/update-plan`, {
      userId: payment.userId,
      plan: payment.plan,
      credits: payment.credits,
    });

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};
