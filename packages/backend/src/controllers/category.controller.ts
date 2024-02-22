import { Request, Response } from "express";
import { Category, PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/errorsHandler";
import { CreateCategory, createCategorySchema } from "../types/category.type";
import RedisService from "../utils/redis-service";

const prisma = new PrismaClient();

export const createCat = async (req: Request, res: Response) => {
  try {
    // CREATE AN INSTANCE OF REDIS CLIENT
    const redis = RedisService.getClient();

    const userId = req.user.id;

    // VALIDATAE DATA FOR CREATING CATEGORY
    const inputCategory: CreateCategory = createCategorySchema.parse(req.body);

    // CHECK IF USER IS SERVER OWNER
    const server = await prisma.server.findFirstOrThrow({
      where: { id: inputCategory.serverId },
      select: { creatorId: true },
    });

    // RETURN 401 IF USER IS NOT SERVER OWNER
    if (server.creatorId !== userId)
      return res.status(401).json({ message: "The user is not the owner" });

    const createdCategory = await prisma.category.create({
      data: {
        name: inputCategory.name,
        createdBy: { connect: { id: userId } },
        server: { connect: { id: inputCategory.serverId } },
      },
    });

    // CLEAR CACHE
    await redis.del(`categories:${inputCategory.serverId}`);

    return res.status(201).json({
      message: `Category ${createdCategory.name} has created`,
      category: createdCategory,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getCatById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params["id"];

    const foundCategory = await prisma.category.findFirstOrThrow({
      where: { id: categoryId },
    });

    return res.status(200).json({
      category: foundCategory,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getCatsByServer = async (req: Request, res: Response) => {
  try {
    // CREATE AN INSTANCE OF REDIS CLIENT
    const redis = RedisService.getClient();

    const serverId = req.params["id"];

    // CHECK IF DATA IS ALREADY CACHED
    const cachedCats = await redis.get(`categories:${serverId}`);

    // IF DATA IS CACHED, RETURN CACHE
    if (cachedCats)
      return res.status(200).json({
        categories: JSON.parse(cachedCats),
        cached: true,
      });

    const foundCats: Category[] = await prisma.category.findMany({
      where: { serverId },
      include: { chanels: true },
    });

    // CACHE CATEGORIES
    await redis.set(
      `categories:${serverId}`,
      JSON.stringify(foundCats),
      "EX",
      60 * 60 * 3,
    );

    // SEND DATA
    return res.status(200).json({
      categories: foundCats,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
