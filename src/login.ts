import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "./server";

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
    res.status(400).json({ errors: "User does not exist." });
    return;
  }

  const pwdCorrect = await bcrypt.compare(data.password, hash);

  if (!pwdCorrect) {
    res.status(400).json({ errors: "Password is not correct." });
    return;
  }

  res.status(200).send();
}
