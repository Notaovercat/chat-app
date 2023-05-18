import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { errorHandler } from "../utils/errorsHandler";
import { log } from "console";
const prisma = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params["id"] as string;

    const userProfile = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        joinedServers: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ user: userProfile });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
