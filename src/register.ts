import { Response, Request } from "express";
import { validationResult } from "express-validator";
import { prisma } from "./server";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createToken, createRefreshtoken } from "./token_utils";

const saltRounds = 10;

interface RegisterData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export default async function register(req: Request, res: Response) {
  const data = req.body as RegisterData;
  try {
    const hash = await bcrypt.hash(data.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        password: hash,
      },
    });

    const token = createToken({
      userId: user.id,
      username: data.username,
    });

    const refreshToken = createRefreshtoken({
      userId: user.id,
      username: data.username,
    });

    res
      .status(StatusCodes.OK)
      .json({ token: token, refreshToken: refreshToken });
  } catch (e) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errors: "Error when inserting new user : " + e });
  }
}
