"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const port = process.env.PORT || 3333;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
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
