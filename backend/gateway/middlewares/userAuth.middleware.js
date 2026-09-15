import redisClient from "../../shared/redis/redis.js";

export const userAuth = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId)
      return res.status(400).json({ message: "Unauthorized access " });

    const session = await redisClient.get(`session-${sessionId}`);

    if (!session) return res.status(400).json({ message: "Session Expired" });

    req.user = JSON.parse(session);

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `userAuth middleware error -`, error });
  }
};
