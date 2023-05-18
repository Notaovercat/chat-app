import { Request, Response } from "express";
import { PrismaClient, Server, User } from "@prisma/client";
import { CreateServer, createServerSchema } from "../types/server.type";
import { errorHandler } from "../utils/errorsHandler";

const prisma = new PrismaClient();

export const createServer = async (req: Request, res: Response) => {
  try {
    // GET USER FROM REQUEST
    const user = req.user as User;

    // GET SERVER DATA FROM BODY REQUEST
    const inputServer: CreateServer = createServerSchema.parse(req.body);

    // CREATE SERVER IN DB
    const createdServer = await prisma.server.create({
      data: {
        name: inputServer.name,
        createdBy: { connect: { id: user.id } },
        members: { connect: { id: user.id } },
      },
    });

    // JOIN USER TO HIS SERVER
    await prisma.user.update({
      where: { id: user.id },
      data: {
        joinedServers: {
          connect: { id: createdServer.id },
        },
      },
    });

    // SEND SUCCESSFUL STATUS
    return res.status(201).json({
      message: `Server ${createdServer.name} has created`,
      server: createdServer,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// GET ALL SERVERS
export const getServers = async (req: Request, res: Response) => {
  try {
    const foundServers: Server[] = await prisma.server.findMany({
      // include: {
      //   members: {
      //     select: { username: true },
      //   },
      // },
    });

    return res.status(200).json({
      servers: foundServers,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// GET ONE SERVER BY ID
export const getServerById = async (req: Request, res: Response) => {
  try {
    const serverId = req.params["id"];

    const foundServer: Server = await prisma.server.findFirstOrThrow({
      where: { id: serverId },
    });

    return res.status(200).json({
      server: foundServer,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// JOIN USER TO A SERVER
export const joinToServer = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const userId = user.id;
    const serverId = req.body["serverId"];

    // JOIN USER TO HIS SERVER
    await prisma.user.update({
      where: { id: user.id },
      data: {
        joinedServers: {
          connect: { id: serverId },
        },
      },
    });

    // ADD USER TO MEMBER LIST
    await prisma.server.update({
      where: { id: serverId },
      data: {
        members: { connect: { id: userId } },
      },
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// GET JOINED SERVERS
export const getJoinedServers = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const userId = user.id;

    const foundJoinedServers = await prisma.server.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    return res.status(200).json({
      servers: foundJoinedServers,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
