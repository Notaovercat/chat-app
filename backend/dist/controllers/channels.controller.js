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
exports.getChansByCat = exports.getChanById = exports.getChans = exports.createChan = void 0;
const client_1 = require("@prisma/client");
const errorsHandler_1 = require("../utils/errorsHandler");
const channel_type_1 = require("../types/channel.type");
const console_1 = require("console");
const prisma = new client_1.PrismaClient();
const createChan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const inputChanel = channel_type_1.createChanelSchema.parse(req.body);
        // Check if user is server owner
        const category = yield prisma.category.findFirstOrThrow({
            where: { id: inputChanel.categoryId },
            select: { creatorId: true },
        });
        if (category.creatorId != user.id)
            return res.status(401).json({ message: "User is not an owner" });
        const createdChanel = yield prisma.chanel.create({
            data: {
                name: inputChanel.name,
                createdBy: { connect: { id: user.id } },
                category: { connect: { id: inputChanel.categoryId } },
            },
        });
        return res.status(201).json({
            message: `Chanel ${createdChanel.name} has created`,
            data: {
                chanel: createdChanel,
            },
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.createChan = createChan;
const getChans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundChanel = yield prisma.chanel.findMany();
        return res.status(200).json({
            data: {
                categories: foundChanel,
            },
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getChans = getChans;
const getChanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chanelId = req.params["id"];
        const foundChanel = yield prisma.chanel.findFirstOrThrow({
            where: { id: chanelId },
        });
        return res.status(200).json({
            data: {
                Chanel: foundChanel,
            },
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getChanById = getChanById;
const getChansByCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { catId } = req.params;
        const foundChanesl = yield prisma.chanel.findMany({
            where: { categoryId: catId },
        });
        (0, console_1.log)(foundChanesl);
        return res.status(200).json({
            data: {
                Chanel: foundChanesl,
            },
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getChansByCat = getChansByCat;
