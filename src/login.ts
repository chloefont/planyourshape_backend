import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "./server";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { createToken, createRefreshtoken } from "./token_utils";

interface LoginData {
  username: string;
  password: string;
}

export default async function login(req: Request, res: Response) {
  const data = req.body as LoginData;

  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  const hash = user?.password;

  if (!hash) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: "User does not exist." });
    return;
  }

  const pwdCorrect = await bcrypt.compare(data.password, hash);

  if (!pwdCorrect) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: "Password is not correct." });
    return;
  }

  const token = createToken({
    userId: user.id,
    username: data.username,
  });

  const refreshToken = createRefreshtoken({
    userId: user.id,
    username: data.username,
  });

  res.status(StatusCodes.OK).send({ token: token, refreshToken: refreshToken });
}
