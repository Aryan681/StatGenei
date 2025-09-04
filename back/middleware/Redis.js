import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// Replace with your actual Redis URL
const redisUrl = process.env.REDIS_URL;

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

// New rate-limiting function
export const rateLimit = async (key, limit, windowInSeconds) => {
  try {
    // INCR increments the key's value. If the key doesn't exist, it's created and set to 1.
    const currentCount = await redisClient.incr(key);

    // If this is the first request in the window, set an expiration time for the key.
    if (currentCount === 1) {
      await redisClient.expire(key, windowInSeconds);
    }

    // Return true if the request is within the limit, otherwise return false.
    return currentCount <= limit;
  } catch (error) {
    console.error("Redis rate-limit error:", error);
    return false; // Fail safe: assume rate-limited to prevent excessive requests if Redis is down.
  }
};

export default redisClient;