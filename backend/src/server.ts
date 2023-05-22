import http, { IncomingMessage } from "http";
import dotenv from "dotenv";
import app from "./app";
import { Socket, Server as SocketServer } from "socket.io";
import { PrismaClient, User } from "@prisma/client";
import { CreateMessage } from "./types/message.type";
import passport from "passport";

declare module "http" {
  interface IncomingMessage {
    user: User;
  }
}

const prisma = new PrismaClient();

dotenv.config();

const port = process.env.PORT || 3333;

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

const wrap = (middleware: any) => (socket: Socket, next: any) =>
  middleware(socket.request, {}, next);
io.use(wrap(passport.initialize()));
io.use(wrap(passport.authenticate("jwt", { session: false })));

io.of("/").on("connect", (socket) => {
  socket.on("join", (chanelId: string) => {
    console.log(`${socket.request.user.id} joined to a ${chanelId}`);
    socket.join(chanelId);
  });

  socket.on("sendMessage", async (input: CreateMessage) => {
    try {
      console.log(
        `Sending messages from ${socket.request.user.id} to ${input.chanelId}`
      );
      const newMessage = await prisma.message
        .create({
          data: {
            creatorId: socket.request.user.id,
            ...input,
          },
          include: {
            createdBy: {
              select: { id: true, username: true },
            },
          },
        })
        .catch((err) => {
          console.error(err);
          return new Error("Failed get messages");
        });

      io.to(input.chanelId).emit("newMessage", newMessage);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("getMessages", async (chanelId: string) => {
    console.log("Load messages for", chanelId);
    const messages = await prisma.message
      .findMany({
        where: {
          chanelId,
        },
        include: {
          createdBy: {
            select: { id: true, username: true },
          },
        },
      })
      .catch((err) => {
        console.error(err);
        return new Error("Failed get messages");
      });

    io.to(chanelId).emit("chanelData", messages);
  });

  socket.on("leaveChanel", (channelId) => {
    console.log(`${socket.request.user.id} left channel ${channelId}`);
    socket.leave(channelId);
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
