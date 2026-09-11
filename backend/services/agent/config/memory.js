import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationID) => {
  try {
    const key = `messages-${conversationID}`;
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
    const messages = await getMessages(conversationID);
    await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
    return messages;
  } catch (error) {
    console.log("Backend - agent - getMemory error -", error);
  }
};

export const addMessages = async (conversationID, role, content) => {
  const key = `messages-${conversationID}`;
  const rawMessages = await redis.get(key);
  const messages = rawMessages ? JSON.parse(rawMessages) : [];
  messages.push({
    role,
    content,
  });
  if (messages.length > 20) {
    messages.shift();
  }
  await redis.set(key, JSON.stringify(messages));
};
