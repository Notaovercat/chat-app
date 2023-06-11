import { Request, Response } from "express";
import { PrismaClient, Server } from "@prisma/client";
import { CreateServer, createServerSchema } from "../types/server.type";
import { errorHandler } from "../utils/errorsHandler";
import RedisService from "../utils/redis-service";

const prisma = new PrismaClient();

const generateRandomCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 5 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

// CREATE SERVER
export const createServer = async (req: Request, res: Response) => {
  try {
    // CREATE AN INSTANCE OF REDIS CLIENT
    const redis = RedisService.getClient();

    // GET USER FROM REQUEST
    const userId = req.user.id;

    // GET SERVER DATA FROM BODY REQUEST
    const inputServer: CreateServer = createServerSchema.parse(
      JSON.parse(req.body.serverInput)
    );

    // GET FILE
    const filePath = req.file?.path;
    const fileName = req.file?.filename;

    // GENERATE JOIN CODE
    const joinCode = generateRandomCode();

    // CREATE SERVER IN DB
    const createdServer = await prisma.server.create({
      data: {
        name: inputServer.name,
        iconPath: filePath,
        iconName: fileName,
        joinCode,
        createdBy: { connect: { id: userId } },
      },
    });

    // JOIN USER TO HIS SERVER
    await prisma.serverJoin.create({
      data: {
        user: { connect: { id: userId } },
        server: { connect: { id: createdServer.id } },
      },
    });

    // CLEAR CACHED SERVERS
    await redis.del(`joinedServers:${userId}`);

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
    // GET USER ID FROM AUTH HEADER
    const userId = req.user.id;

    // GET JOIN CODE FROM THE PARAM
    const joinCode = req.params["joinCode"];

    // CREATE AN INSTANCE OF REDIS CLIENT
    const redis = RedisService.getClient();

    // CLEAR CACHED SERVERS
    await redis.del(`joinedServers:${userId}`);

    // FIND SERVER
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

    // CLEAR CACHE OF SERVER MEMBERS
    await redis.del(`members:${server.id}`);

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
    // CREATE AN INSTANCE OF REDIS CLIENT
    const redis = RedisService.getClient();

    // GET USER ID FROM AUTH HEADER
    const userId = req.user.id;

    const cachedServers = await redis.get(`joinedServers:${userId}`);

    if (cachedServers) {
      // IF DATA IS CACHED, RETURN CACHE
      const servers = JSON.parse(cachedServers);
      return res.status(200).json({ servers, cached: true });
    }

    // MAKE A QUERY
    const foundJoinedServers = await prisma.serverJoin.findMany({
      where: { userId },
      select: {
        server: true,
      },
    });

    // RETURN THE ARRAY OF JOINED SERVERS
    const servers: Server[] = foundJoinedServers.reduce(
      (acc: any, { server }) => {
        acc[server.id] = server;
        return acc;
      },
      {}
    );

    // CACHE THE RESULT OF THE QUERY
    await redis.set(
      `joinedServers:${userId}`,
      JSON.stringify(servers),
      "EX",
      60 * 60 * 3,
      "NX"
    );
    return res.status(200).json({
      servers,
      cached: false,
    });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// GET ARRAY OF MEMBERS OF THE SERVER BY ID
export const getMembers = async (req: Request, res: Response) => {
  try {
    // CREATE AN INSTANCE OF REDIS CLIENT
    // const redis = RedisService.getClient();

    // GET SERVER ID FROM PARAMS
    const serverId = req.params["serverId"];

    // GET usersJoined RECORD BY SERVER ID
    const usersJoined = await prisma.serverJoin.findMany({
      where: {
        serverId: serverId,
      },
      include: {
        user: true,
      },
    });

    // RETURN ARRAY OF USERS
    const joinedUsers = usersJoined.map((join) => join.user);

    // SEND DATA
    return res.status(200).json({ members: joinedUsers, cache: false });
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};
