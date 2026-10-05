import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import { app } from "../config/firebase.js";
import redisClient from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    const sessionId = crypto.randomUUID();

    await redisClient.set(
      `session-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json(user);
  } catch (e) {
    console.log("login using firebase error - ", e.message);
    return res.status(500).json({ message: "Internal Server Error !!" });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    await redisClient.del(`session-${sessionId}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logout succesfully !!" });
  } catch (e) {
    res.status(400).json({ message: `Logout Error - ${e.message}` });
  }
};

export const updateUserPlan = async (req, res) => {
  try {
    const { plan, credits, userId, totalCredits } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.plan = plan;
    user.credits += credits;
    user.totalCredits += totalCredits;
    user.planExpiryAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Extend plan expiry by 30 days
    await user.save();

    const sessionId = req.cookies?.session;
    await redisClient.set(
      `session-${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiryAt: user.planExpiryAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );
    return res.status(200).json({ message: "User plan updated successfully" });
  } catch (error) {
    console.error("Error updating user plan:", error);
    res.status(500).json({ error: "Failed to update user plan" });
  }
};
