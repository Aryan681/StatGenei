import Redis from "ioredis";

// Replace with your actual Redis URL
const redisUrl = "redis://default:rwEnJpVAlAxTXIFzO5U0ynP4wWLlOlYY@redis-15287.crce206.ap-south-1-1.ec2.redns.redis-cloud.com:15287";

const redisClient = new Redis(redisUrl);

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis server");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export const getCache = async (key) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error("Redis GET error:", error);
    return null;
  }
};

export const setCache = async (key, data, expiresInSeconds = 3600) => {
  try {
    const serializedData = JSON.stringify(data);
    // EX sets the expiration time in seconds
    await redisClient.set(key, serializedData, "EX", expiresInSeconds);
  } catch (error) {
    console.error("Redis SET error:", error);
  }
};

export default redisClient;