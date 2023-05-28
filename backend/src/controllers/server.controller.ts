import { Request, Response } from "express";
import { PrismaClient, Server, User } from "@prisma/client";
import { CreateServer, createServerSchema } from "../types/server.type";
import { errorHandler } from "../utils/errorsHandler";

const prisma = new PrismaClient();

const generateRandomCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 5 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

export const createServer = async (req: Request, res: Response) => {
  try {
    // GET USER FROM REQUEST
    const user = req.user as User;

    // GET SERVER DATA FROM BODY REQUEST
    const inputServer: CreateServer = createServerSchema.parse(
      JSON.parse(req.body.serverInput)
    );

    // GET FILE
    const filePath = req.file?.path;
    const fileName = req.file?.filename;
    console.log(fileName);

    // GENERATE JOIN CODE
    const joinCode = generateRandomCode();

    // CREATE SERVER IN DB
    const createdServer = await prisma.server.create({
      data: {
        name: inputServer.name,
        iconPath: filePath,
        iconName: fileName,
        joinCode,
        createdBy: { connect: { id: user.id } },
      },
    });

    // JOIN USER TO HIS SERVER
    await prisma.serverJoin.create({
      data: {
        user: { connect: { id: user.id } },
        server: { connect: { id: createdServer.id } },
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
    const foundServers: Server[] = await prisma.server.findMany();

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
    const joinCode = req.params["joinCode"];

    const server = await prisma.server.findFirstOrThrow({
      where: { joinCode },
      include: {
        members: true,
      },
    });

    // JOIN USER TO SERVER
    await prisma.serverJoin.create({
      data: {
        server: { connect: { id: server.id } },
        user: { connect: { id: userId } },
      },
    });

    return res
      .status(200)
      .json({ message: "User has joined to server", server });
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

    const foundJoinedServers = await prisma.serverJoin.findMany({
      where: { userId: userId },
      select: {
        server: true,
      },
    });

    // const servers
    const servers: Server[] = foundJoinedServers.reduce(
      (acc: any, { server }) => {
        acc[server.id] = server;
        return acc;
      },
      {}
    );
    return res.status(200).json({
      servers,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// GET ARRAY OF MEMBERS OF THE SERVER BY ID
export const getMembers = async (req: Request, res: Response) => {
  try {
    const serverId = req.params["serverId"];

    const usersJoined = await prisma.serverJoin.findMany({
      where: {
        serverId: serverId,
      },
      include: {
        user: true,
      },
    });

    const joinedUsers = usersJoined.map((join) => join.user);
    res.status(200).json({ members: joinedUsers });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
