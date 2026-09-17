import redisClient from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
  try {
    const key = `messages-${conversationId}`;
    const cached = await redisClient.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const messages = await getMessages(conversationId);
    await redisClient.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
    return messages;
  } catch (error) {
    console.log("getMemory error:", error);
  }
};

export const addMessages = async (conversationId, role, content) => {
  try {
    const key = `messages-${conversationId}`;
    const rawMessages = await redisClient.get(key);

    const messages = rawMessages ? JSON.parse(rawMessages) : [];

    messages.push({
      role,
      content,
    });

    if (messages.length > 20) {
      messages.shift();
    }

    await redisClient.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
  } catch (error) {
    console.log("addMessage error -", error);
  }
};
