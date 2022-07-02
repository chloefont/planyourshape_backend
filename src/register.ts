import { Response, Request } from "express";
import { validationResult } from "express-validator";
import { prisma } from "./server";
import bcrypt from "bcrypt";

const saltRounds = 10;

interface RegisterData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export default async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

    res.status(200).json(user);
  } catch (e) {
    return res
      .status(400)
      .json({ errors: "Error when inserting new user : " + e });
  }
}
