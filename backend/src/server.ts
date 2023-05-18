import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { Server as SocketServer } from "socket.io";

dotenv.config();

const port = process.env.PORT || 3333;

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

io.on("connect", (socket) => {
  console.log("User has connected");

  socket.on("send message", (msg) => {
    msg = "Message: " + msg;
    socket.emit("recieve message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User has disconnected");
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
