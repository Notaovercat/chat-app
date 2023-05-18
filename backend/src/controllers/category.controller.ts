import { Request, Response } from "express";
import { Category, PrismaClient, User } from "@prisma/client";
import { errorHandler } from "../utils/errorsHandler";
import { CreateCategory, createCategorySchema } from "../types/category.type";

const prisma = new PrismaClient();

export const createCat = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const inputCategory: CreateCategory = createCategorySchema.parse(req.body);

    // CHECK IF USER IS SERVER OWNER
    const server = await prisma.server.findFirstOrThrow({
      where: { id: inputCategory.serverId },
      select: { creatorId: true },
    });

    if (server.creatorId != user.id)
      return res.status(401).json({ message: "User is not an owner" });

    const createdCategory = await prisma.category.create({
      data: {
        name: inputCategory.name,
        createdBy: { connect: { id: user.id } },
        server: { connect: { id: inputCategory.serverId } },
      },
    });

    return res.status(201).json({
      message: `Category ${createdCategory.name} has created`,
      category: createdCategory,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getCats = async (req: Request, res: Response) => {
  try {
    const foundCategory: Category[] = await prisma.category.findMany();

    return res.status(200).json({
      categories: foundCategory,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

export const getCatById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params["id"];

    const foundCategory: Category = await prisma.category.findFirstOrThrow({
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
    const serverId = req.params["id"];

    const foundCats: Category[] = await prisma.category.findMany({
      where: { serverId },
      include: { chanels: true },
    });

    return res.status(200).json({
      categories: foundCats,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
