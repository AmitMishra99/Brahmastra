const redis = require("ioredis");

const redisClient = new redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  console.log("Redis Connected !!");
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

module.exports = redisClient;
