// Importing module
import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import register from "./register";
import login from "./login";
import token_verify from "./middlewares/token_verify";
import checkBodyArgsErrors from "./middlewares/body_args_errors";
import { refreshToken } from "./token_utils";

require("dotenv").config();
export const prisma = new PrismaClient();

const app = express();
const PORT: Number = 3000;

main();

async function main() {
  prisma.$connect();

  app.use(bodyParser.json());

  // Handling GET / Request
  app.get("/", (req, res) => {
    res.send("Welcome to typescript backend!");
  });

  app.post(
    "/login",
    body("username").isLength({ min: 4 }),
    body("password").isLength({ min: 8 }),
    checkBodyArgsErrors,
    login
  );

  app.post(
    "/register",
    body("password").isLength({ min: 8 }),
    body("email").isEmail(),
    body("firstname").isLength({ min: 2 }),
    body("lastname").isLength({ min: 2 }),
    body("username").isLength({ min: 4 }),
    checkBodyArgsErrors,
    register
  );

  app.get("/test", token_verify, (req, res) => {
    res.send("coucou");
  });

  app.post(
    "/refresh_token",
    body("refreshToken").isString(),
    checkBodyArgsErrors,
    refreshToken
  );

  // Server setup
  app.listen(PORT, () => {
    console.log(
      "The application is listening " + "on port http://localhost:" + PORT
    );
  });
}
