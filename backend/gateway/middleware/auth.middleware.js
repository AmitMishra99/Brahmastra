const redisClient = require("../../shared/redis/redis");

const protect = async (req, res, next) => {
  try {
    const sessionID = req.cookies?.session;
    if (!sessionID)
      return res.status(400).json({ message: "Unaouthorized access " });

    const session = await redisClient.get(`session-${sessionID}`);

    if (!session) return res.status(400).json({ message: "Session Expired" });

    req.user = JSON.parse(session);
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Protect middleware error -`, error });
  }
};

module.exports = protect;
