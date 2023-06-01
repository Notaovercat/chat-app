import { Chanel, PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { errorHandler } from "../utils/errorsHandler";
import { CreateChanel, createChanelSchema } from "../types/channel.type";
import RedisService from "../utils/redis";
import { log } from "console";
const prisma = new PrismaClient();

export const createChan = async (req: Request, res: Response) => {
  try {
    // CREATE AN INSTANCE OF REDIS CLIENT
    const redis = RedisService.getClient();

    const userId = req.user.id;
    const inputChanel: CreateChanel = createChanelSchema.parse(req.body);

    // Check if user is server owner
    const category = await prisma.category.findFirstOrThrow({
      where: { id: inputChanel.categoryId },
      select: { creatorId: true, serverId: true },
    });

    if (category.creatorId != userId)
      return res.status(401).json({ message: "User is not an owner" });

    const createdChanel = await prisma.chanel.create({
      data: {
        name: inputChanel.name,
        createdBy: { connect: { id: userId } },
        category: { connect: { id: inputChanel.categoryId } },
      },
    });

    // CLEAR CASHE
    await redis.del(`categories:${category.serverId}`);

    return res.status(201).json({
      message: `Chanel ${createdChanel.name} has created`,
      data: {
        chanel: createdChanel,
      },
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getChanById = async (req: Request, res: Response) => {
  try {
    const chanelId = req.params["id"];

    const foundChanel: Chanel = await prisma.chanel.findFirstOrThrow({
      where: { id: chanelId },
    });

    return res.status(200).json({
      data: {
        Chanel: foundChanel,
      },
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getChansByCat = async (req: Request, res: Response) => {
  try {
    const { catId } = req.params;
    const foundChanesl: Chanel[] = await prisma.chanel.findMany({
      where: { categoryId: catId },
    });
    log(foundChanesl);
    return res.status(200).json({
      data: {
        Chanel: foundChanesl,
      },
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
