import { Message, PrismaClient } from '@prisma/client';
import { Server } from "http";
import passport from "passport";
import { Server as SocketServer, Socket } from "socket.io";
import { CreateMessage } from '../types/message.type';
const prisma = new PrismaClient();

export default function setupSocket(server: Server, port: number) {
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
				const server = await prisma.server.findFirst({
					include: {
						members: true,
					},
					where: {
						members: {
							some: {
								userId: socket.request.user.id,
							},
						},
					},
				});
	
				if (!server) throw new Error("Unauthrized");
	
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
								select: { id: true, username: true, avatarName: true },
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
	
		socket.on("getMessages", async (chanelId: string, page: number = 0) => {
			console.log("Load messages for", chanelId);
			const messagesCount = await prisma.message.count({ where: { chanelId } });
			const messages = await prisma.message
				.findMany({
					where: {
						chanelId,
					},
					include: {
						createdBy: {
							select: { id: true, username: true, avatarName: true },
						},
					},
					orderBy: {
						createdAt: "desc",
					},
					take: 10,
					skip: page,
				})
				.catch((err) => {
					console.error(err);
					return new Error("Failed get messages");
				});
	
			const reversedMessages = (
				messages as Array<
					Message & {
						createdBy: {
							id: string;
							username: string;
							avatarName: string | null;
						};
					}
				>
			).reverse();
	
			const hasMore = page + reversedMessages.length <= messagesCount;
	
			hasMore
				? socket.emit("onGetMessages", reversedMessages)
				: socket.emit("onEmpty");
		});
	
		socket.on(
			"updateMessage",
			async (chanelId: string, messageId: string, content: string) => {
				const foundMessage = await prisma.message
					.findFirstOrThrow({ where: { id: messageId } })
					.catch((err) => console.log(err));
	
				if (socket.request.user.id != foundMessage?.creatorId)
					throw new Error("Unauthorized");
	
				console.log(`Updating ${socket.request.user.id}'s message`);
	
				const updatedMessage = await prisma.message
					.update({
						where: { id: messageId },
						data: { content, isMessageUpdated: true },
						include: {
							createdBy: {
								select: { id: true, username: true, avatarName: true },
							},
						},
					})
					.catch((err) => console.log(err));
	
				io.to(chanelId).emit("onUpdateMessage", updatedMessage);
			}
		);
	
		socket.on("deleteMessage", async (chanelId: string, messageId: string) => {
			const foundMessage = await prisma.message
				.findFirstOrThrow({ where: { id: messageId } })
				.catch((err) => console.log(err));
			if (socket.request.user.id != foundMessage?.creatorId)
				throw new Error("Unauthorized");
	
			console.log(`Deleting ${socket.request.user.id}'s message`);
			const deletedMessage = await prisma.message
				.update({
					where: { id: messageId },
					data: { content: "Message was deleted", isMessageDeleted: true },
					include: {
						createdBy: {
							select: { id: true, username: true, avatarName: true },
						},
					},
				})
				.catch((err) => console.log(err));
	
			io.to(chanelId).emit("onUpdateMessage", deletedMessage);
		});
	
		socket.on("leaveChanel", (channelId) => {
			console.log(`${socket.request.user.id} left channel ${channelId}`);
			socket.leave(channelId);
		});
	});

  return io;
}
