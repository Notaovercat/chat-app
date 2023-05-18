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
exports.getCatsByServer = exports.getCatById = exports.getCats = exports.createCat = void 0;
const client_1 = require("@prisma/client");
const errorsHandler_1 = require("../utils/errorsHandler");
const category_type_1 = require("../types/category.type");
const prisma = new client_1.PrismaClient();
const createCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const inputCategory = category_type_1.createCategorySchema.parse(req.body);
        // CHECK IF USER IS SERVER OWNER
        const server = yield prisma.server.findFirstOrThrow({
            where: { id: inputCategory.serverId },
            select: { creatorId: true },
        });
        if (server.creatorId != user.id)
            return res.status(401).json({ message: "User is not an owner" });
        const createdCategory = yield prisma.category.create({
            data: {
                name: inputCategory.name,
                createdBy: { connect: { id: user.id } },
                server: { connect: { id: inputCategory.serverId } },
            },
        });
        return res.status(201).json({
            message: `Category ${createdCategory.name} has created`,
            category: createdCategory,
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.createCat = createCat;
const getCats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundCategory = yield prisma.category.findMany();
        return res.status(200).json({
            categories: foundCategory,
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getCats = getCats;
const getCatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params["id"];
        const foundCategory = yield prisma.category.findFirstOrThrow({
            where: { id: categoryId },
        });
        return res.status(200).json({
            category: foundCategory,
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getCatById = getCatById;
const getCatsByServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serverId = req.params["id"];
        const foundCats = yield prisma.category.findMany({
            where: { serverId },
            include: { chanels: true },
        });
        return res.status(200).json({
            categories: foundCats,
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getCatsByServer = getCatsByServer;
