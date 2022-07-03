import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redisDb from "./redis_connection";

interface RefreshToken {
  userId: string;
  username: string;
  tokenId: string;
}

interface RefreshTokenDecoded extends RefreshToken {
  iat: number;
  exp: number;
}

export function createToken(data: Object): string {
  return jwt.sign(data, process.env.SECRET!, {
    expiresIn: "5m",
  });
}

export function createRefreshtoken(userId: string, username: string): string {
  const tokenId = uuidv4();

  const data: RefreshToken = {
    tokenId: tokenId,
    userId: userId,
    username: username,
  };

  const refreshToken = jwt.sign(data, process.env.SECRET_REFRESH!, {
    expiresIn: "7d",
  });

  redisDb.addRrefreshToken(
    userId,
    tokenId,
    (jwt.decode(refreshToken) as JwtPayload).exp!,
    true
  );

  return refreshToken;
}

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: "Should give a refresh token." });
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.SECRET_REFRESH!
    ) as RefreshTokenDecoded;
  } catch (e) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ errors: "Given refresh token is not correct" });
    return;
  }

  let refreshTokenInfo;
  try {
    refreshTokenInfo = await redisDb.getRefreshTokenInfo(
      decoded.userId,
      decoded.tokenId
    );
  } catch (e) {
    res.status(StatusCodes.UNAUTHORIZED).json({ errors: e });
    return;
  }

  if (!refreshTokenInfo.valid) {
    redisDb.deleteUserAllRefreshTokens(decoded.userId);

    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ errors: "Given refresh token is not correct" });
    return;
  }

  redisDb.addRrefreshToken(decoded.userId, decoded.tokenId, decoded.exp, false);

  const newToken = createToken({
    userId: decoded.userId,
    username: decoded.username,
  });

  const newRefreshToken = createRefreshtoken(decoded.userId, decoded.username);

  res
    .status(StatusCodes.OK)
    .send({ token: newToken, refreshToken: newRefreshToken });
}
