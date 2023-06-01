import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SignUpInput, signUpSchema } from "../types/signUp.type";
import { errorHandler } from "../utils/errorsHandler";
import jwt from "jsonwebtoken";
import { Payload } from "../types/payload.type";
import { compare, hash } from "bcrypt";
import { SignInInput, signInSchema } from "../types/signIn.type";

const prisma = new PrismaClient();

// CREATE JWT FUNCTION
// CREATES TOKEN WITH PAYLOAD
const createJwt = (payload: Payload): string => {
  // GET SECRET WORD FROM ENV OR SET DEFAULT
  const secretWord = process.env.JWT_SECRET || "secret";

  // SET JWT OPRION "EXPIRES IN"
  const tokenOptions: jwt.SignOptions = { expiresIn: "7d" };

  // CREATE TOKEN
  const token = jwt.sign(payload, secretWord, tokenOptions);
  return token;
};

// USER SIGN UO FUNCTION
// CREATES USER AND SENDS JWT
export const signUp = async (req: Request, res: Response) => {
  try {
    // EXTRACT USER FROM BODY REQUEST
    const inputUser: SignUpInput = signUpSchema.parse(req.body);

    // HASH USER PASSWORD
    const hashedPassword = await hash(inputUser.password, 12);

    // CREATE USER ON DB
    const createdUser = await prisma.user.create({
      data: { ...inputUser, password: hashedPassword },
    });

    // CREATE PAYLOAD WITH ID AND EMAIL FOR JWT
    const paylaod: Payload = {
      id: createdUser.id,
      email: createdUser.email,
    };

    // CREATE JWT
    const token = createJwt(paylaod);

    // SEND USER A TOKEN
    return res.status(201).json({
      message: `User ${createdUser.username} has created`,
      token,
      id: createdUser.id,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// USER SIGN IN FUNCTION
// CHECK USER CREDENTIONALS
export const signIn = async (req: Request, res: Response) => {
  try {
    // GET USER CREDENTIONALS FROM BIDY REQUEST
    const inputUser: SignInInput = signInSchema.parse(req.body);

    // FIND USER BY EMAIL
    const signingUser = await prisma.user.findFirst({
      where: { email: inputUser.email },
    });

    // THROW ERROR IF USER NOT FOUND
    if (!signingUser)
      return res.status(401).json({ message: "No user with such email" });

    // COMPARE USER PASSWORD WITH PASSWORD FROM DB
    const isPassCorrect = await compare(
      inputUser.password,
      signingUser.password
    );

    // THROW ERROR IF PASSWORD IS INCORRECT
    if (!isPassCorrect)
      return res.status(401).json({ message: "Wrong password" });

    // CREATE PAYLOAD WITH ID AND EMAIL FOR JWT
    const payload: Payload = {
      id: signingUser.id,
      email: signingUser.email,
    };

    // CREATE JWT
    const token = createJwt(payload);

    // SEND JWT
    return res
      .status(201)
      .json({ message: "User has sign in", token: token, id: signingUser.id });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
