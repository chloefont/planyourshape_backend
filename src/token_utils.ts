import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

interface RefreshTokenBody {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export function createToken(data: Object): string {
  return jwt.sign(data, process.env.SECRET!, {
    expiresIn: "5m",
  });
}

export function createRefreshtoken(data: Object): string {
  return jwt.sign(data, process.env.SECRET_REFRESH!, {
    expiresIn: "7d",
  });
}

export function refreshToken(req: Request, res: Response) {
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
    ) as RefreshTokenBody;
  } catch (e) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ errors: "Given refresh token is not correct" });
    return;
  }

  const newToken = createToken({
    userId: decoded.userId,
    username: decoded.username,
  });

  const newRefreshToken = createRefreshtoken({
    userId: decoded.userId,
    username: decoded.username,
  });

  res
    .status(StatusCodes.OK)
    .send({ token: newToken, refreshToken: newRefreshToken });
}
