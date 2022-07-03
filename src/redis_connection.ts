import * as redis from "redis";

class RedisConnection {
  private client;

  constructor() {
    this.client = redis.createClient();

    this.client.on("connect", () => {
      console.log("Connected to redis db");
    });

    this.client.on("error", (err) => {
      console.log(err);
    });

    this.client.connect();
  }

  async addRrefreshToken(
    userId: string,
    tokenId: string,
    exp: number,
    valid: boolean
  ) {
    await this.client.HSET(userId, tokenId, JSON.stringify({ exp, valid }));
  }

  async getRefreshTokenInfo(userId: string, tokenId: string) {
    const tokenInfo = await this.client.hGet(userId, tokenId);
    if (!tokenInfo) {
      throw new Error("Error while getting refresh token infos.");
    }

    return JSON.parse(tokenInfo);
  }

  deleteUserAllRefreshTokens(userId: string) {
    this.client.del(userId);
  }
}

export default new RedisConnection();
