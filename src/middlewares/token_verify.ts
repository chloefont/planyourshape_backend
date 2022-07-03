import { NextFunction, Request, Response, Express } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export default function tokenVerify(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(StatusCodes.BAD_REQUEST).json({ errors: "Must give a token." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET!);

    req.body.decodedToken = decoded;
  } catch (e) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ errors: "Given token is not correct" });
    return;
  }

  next();
}
