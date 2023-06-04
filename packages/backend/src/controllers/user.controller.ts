import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { errorHandler } from "../utils/errorsHandler";
import RedisService from "../utils/redis";
const prisma = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // CREATE AN INSTANCE OF REDIS CLIENT
    const redis = RedisService.getClient();

    // GET USER ID FROM PARAMS
    const userId = req.params["id"] as string;

    // CHECK IF DATA IS CACHED
    const cachedProfile = await redis.get(`profile:${userId}`);

    if (cachedProfile) {
      // IF DATA IS CACHED, RETURN CACHE
      const userProfile = JSON.parse(cachedProfile);
      return res.status(200).json({ user: userProfile, cached: true });
    } else {
      // IF IT'S NOT, STORE THE RESULT OF DB QUERY
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

      await redis.set(`profile:${userId}`, JSON.stringify(userProfile));

      return res.status(200).json({ user: userProfile, cached: false });
    }
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const addAvatar = async (req: Request, res: Response) => {
  try {
    const filePath = req.file?.path;
    const fileName = req.file?.filename;

    const redis = RedisService.getClient();
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

    await redis.del(`profile:${userId}`);

    return res.status(201).json({ message: "Avatar was updated" });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
