"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJoinedServers = exports.joinToServer = exports.getServerById = exports.getServers = exports.createServer = void 0;
const client_1 = require("@prisma/client");
const server_type_1 = require("../types/server.type");
const errorsHandler_1 = require("../utils/errorsHandler");
const prisma = new client_1.PrismaClient();
const createServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // GET USER FROM REQUEST
        const user = req.user;
        // GET SERVER DATA FROM BODY REQUEST
        const inputServer = server_type_1.createServerSchema.parse(req.body);
        // CREATE SERVER IN DB
        const createdServer = yield prisma.server.create({
            data: {
                name: inputServer.name,
                createdBy: { connect: { id: user.id } },
                members: { connect: { id: user.id } },
            },
        });
        // JOIN USER TO HIS SERVER
        yield prisma.user.update({
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
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.createServer = createServer;
// GET ALL SERVERS
const getServers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundServers = yield prisma.server.findMany({
        // include: {
        //   members: {
        //     select: { username: true },
        //   },
        // },
        });
        return res.status(200).json({
            servers: foundServers,
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getServers = getServers;
// GET ONE SERVER BY ID
const getServerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serverId = req.params["id"];
        const foundServer = yield prisma.server.findFirstOrThrow({
            where: { id: serverId },
        });
        return res.status(200).json({
            server: foundServer,
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getServerById = getServerById;
// JOIN USER TO A SERVER
const joinToServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user.id;
        const serverId = req.body["serverId"];
        // JOIN USER TO HIS SERVER
        yield prisma.user.update({
            where: { id: user.id },
            data: {
                joinedServers: {
                    connect: { id: serverId },
                },
            },
        });
        // ADD USER TO MEMBER LIST
        yield prisma.server.update({
            where: { id: serverId },
            data: {
                members: { connect: { id: userId } },
            },
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.joinToServer = joinToServer;
// GET JOINED SERVERS
const getJoinedServers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user.id;
        const foundJoinedServers = yield prisma.server.findMany({
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
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getJoinedServers = getJoinedServers;
