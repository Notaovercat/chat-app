import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { SignUpInput, signUpSchema } from "../types/signUp.type";
import { errorHandler } from "../utils/errorsHandler";
import jwt from "jsonwebtoken";
import { Payload } from "../types/payload.type";
import { SignInInput, signInSchema } from "../types/signIn.type";
import { hash, verify } from "argon2";

const prisma = new PrismaClient();

// CREATES TOKEN WITH PAYLOAD
const createJwt = (payload: Payload): string => {
  const secretWord = process.env.JWT_SECRET || "secret";

  // CREATE TOKEN
  return jwt.sign(payload, secretWord, { expiresIn: "7d" });
};

// CREATES USER AND SENDS JWT
export const signUp = async (req: Request, res: Response) => {
  try {
    // EXTRACT USER FROM BODY REQUEST
    const inputUser: SignUpInput = signUpSchema.parse(req.body);

    const hashedPassword = await hash(inputUser.password);

    const createdUser = await prisma.user.create({
      data: { ...inputUser, password: hashedPassword },
    });

    const token = createJwt({
      id: createdUser.id,
      email: createdUser.email,
    });

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

// CHECK USER CREDENTIONALS
export const signIn = async (req: Request, res: Response) => {
  try {
    // GET USER CREDENTIONALS FROM BIDY REQUEST
    const inputUser: SignInInput = signInSchema.parse(req.body);

    const signingUser = await prisma.user.findFirst({
      where: { email: inputUser.email },
    });

    if (!signingUser)
      return res.status(401).json({ message: "No user with such email" });

    // COMPARE USER PASSWORD WITH PASSWORD FROM DB
    const isPassCorrect = await verify(
      signingUser.password,
      inputUser.password,
    );

    if (!isPassCorrect)
      return res.status(401).json({ message: "Wrong password" });

    const payload: Payload = {
      id: signingUser.id,
      email: signingUser.email,
    };

    const token = createJwt(payload);

    return res
      .status(201)
      .json({ message: "User has sign in", token: token, id: signingUser.id });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getMe = (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};
