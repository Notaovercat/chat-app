import Redis from "ioredis";

class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: 6379,
    }).on("error", (error) => {
      console.log(error);
      throw new Error("Redis error");
    });
  }

  public getClient(): Redis {
    return this.redis;
  }

  public closeConnection(): void {
    this.redis.quit();
  }
}

export default new RedisService();
