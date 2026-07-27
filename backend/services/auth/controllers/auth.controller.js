const { getAuth } = require("firebase-admin/auth");
const app = require("../config/firebase.js");
const User = require("../models/user.model.js");
const crypto = require("crypto");
const redisClient = require("../../../shared/redis/redis.js");

const login = async (req, res) => {
  try {
    const { token } = req.body;
    console.log(req.body);
    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUID: decoded.uid,
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
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (e) {
    console.log("login using firebase error - ", e.message);
    return res.status(500).json({ message: "Internal Server Error !!" });
  }
};

const logout = async (req, res) => {
  try {
    const sessionID = req.cookies?.session;
    await redisClient.del(`session-${sessionID}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logout done !!" });
  } catch (e) {
    res.status(400).json({ message: `Logout Error - ${e.message}` });
  }
};
module.exports = { login, logout };
