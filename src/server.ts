// Importing module
import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import register from "./register";
import login from "./login";

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
    login
  );

  app.post(
    "/register",
    body("password").isLength({ min: 8 }),
    body("email").isEmail(),
    body("firstname").isLength({ min: 2 }),
    body("lastname").isLength({ min: 2 }),
    body("username").isLength({ min: 4 }),
    register
  );

  // Server setup
  app.listen(PORT, () => {
    console.log(
      "The application is listening " + "on port http://localhost:" + PORT
    );
  });
}
