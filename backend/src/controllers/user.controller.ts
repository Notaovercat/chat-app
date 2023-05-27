import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { errorHandler } from "../utils/errorsHandler";
const prisma = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params["id"] as string;

    const userProfile = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        id: true,
        avatarName: true,
        avatarUrl: true,
        username: true,
        email: true,
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

export const addAvatar = async (req: Request, res: Response) => {
  try {
    const filePath = req.file?.path;
    const fileName = req.file?.filename;

    if (!filePath || !fileName) {
      return res.status(400).json({ message: "Empty file" });
    }

    const userId = req.user.id;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: filePath,
        avatarName: fileName,
      },
    });

    return res.status(201).json({ message: "Avatar was updated" });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
