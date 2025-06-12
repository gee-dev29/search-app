import consola from "consola";
import dotenv from "dotenv";
import redis from "redis";
dotenv.config();

const redisClient = redis.createClient();

const connectRedis = async () => {
  redisClient.on("error", (err) => {
    consola.error(`Redis error: ${err}`);
  });

  redisClient.on("connect", () => {
    consola.success({ message: "Redis Connected", badge: true });
  });
  redisClient.on("ready", () => {
    consola.success({ message: "Redis is ready to use", badge: true });
  });

  await redisClient.connect();
  await redisClient.ping();
};

export  {redisClient, connectRedis};
