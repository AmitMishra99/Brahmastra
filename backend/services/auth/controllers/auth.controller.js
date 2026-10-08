import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import { app } from "../config/firebase.js";
import redisClient from "../../../shared/redis/redis.js";
import { COST } from "../utils/cost.js";

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
      `user-session-${user?._id}`,
      sessionId,
      "EX",
      7 * 24 * 60 * 60,
    );

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
    const { plan, credits, userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;

    user.planExpiryAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await user.save();

    const sessionId = await redisClient.get(`user-session-${user?._id}`);

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

    return res.status(200).json({
      message: "User plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating user plan:", error);

    return res.status(500).json({
      error: "Failed to update user plan",
    });
  }
};

export const deductCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const requiredCredits = COST[agent] || 1;

    if (!requiredCredits) {
      return res.status(400).json({
        error: "Invalid agent",
      });
    }

    if (user.credits < requiredCredits) {
      return res.status(400).json({
        error: "Not enough credits",
      });
    }

    user.credits -= requiredCredits;

    await user.save();

    const sessionId = await redisClient.get(`user-session-${user._id}`);

    if (sessionId) {
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
    }

    return res.status(200).json({
      message: "Credits deducted",
      credits: user.credits,
    });
  } catch (error) {
    console.log("Deduct Credits error:", error);

    return res.status(500).json({
      error: "Failed to deduct credits",
    });
  }
};
