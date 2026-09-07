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

    const sessionID = crypto.randomUUID();

    await redisClient.set(
      `session-${sessionID}`,
      JSON.stringify({
        userID: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("session", sessionID, {
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
    const sessionID = req.cookies?.session;
    await redisClient.del(`session-${sessionID}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logout succesfully !!" });
  } catch (e) {
    res.status(400).json({ message: `Logout Error - ${e.message}` });
  }
};
