import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { User } from "@prisma/client";

import setupSocket from "./socket/socket";

// ADD USER TO SOCKET'S REQUEST
declare module "http" {
  interface IncomingMessage {
    user: User;
  }
}

dotenv.config();

const port = process.env.PORT as unknown as number;

const server = http.createServer(app);

setupSocket(server, port);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
