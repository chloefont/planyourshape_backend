import { Request, Response } from "express";
import redisDb from "./redis_connection";
import { StatusCodes } from "http-status-codes";
import { TokenDecoded } from "./token_utils";

export default function logout(req: Request, res: Response) {
  const token = req.body.decodedToken as TokenDecoded;
  redisDb.deleteUserAllRefreshTokens(token.userId);

  //TODO logout

  res.status(StatusCodes.OK).json();
}
