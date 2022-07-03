import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "./server";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

interface LoginData {
  username: string;
  password: string;
}

export default async function login(req: Request, res: Response) {
  const data = req.body as LoginData;

  const hash = (
    await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    })
  )?.password;

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

  const token = jwt.sign({ username: data.username }, process.env.SECRET!, {
    expiresIn: "40s",
  });

  res.status(StatusCodes.OK).send(token);
}
