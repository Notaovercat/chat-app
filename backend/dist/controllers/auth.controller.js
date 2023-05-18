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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.signIn = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const signUp_type_1 = require("../types/signUp.type");
const errorsHandler_1 = require("../utils/errorsHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const signIn_type_1 = require("../types/signIn.type");
const prisma = new client_1.PrismaClient();
// CREATE JWT FUNCTION
// CREATES TOKEN WITH PAYLOAD
const createJwt = (payload) => {
    // GET SECRET WORD FROM ENV OR SET DEFAULT
    const secretWord = process.env.JWT_SECRET || "secret";
    // SET JWT OPRION "EXPIRES IN"
    const tokenOptions = { expiresIn: "7d" };
    // CREATE TOKEN
    const token = jsonwebtoken_1.default.sign(payload, secretWord, tokenOptions);
    return token;
};
// USER SIGN UO FUNCTION
// CREATES USER AND SENDS JWT
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // EXTRACT USER FROM BODY REQUEST
        const inputUser = signUp_type_1.signUpSchema.parse(req.body);
        // HASH USER PASSWORD
        const hashedPassword = yield (0, bcrypt_1.hash)(inputUser.password, 12);
        // CREATE USER ON DB
        const createdUser = yield prisma.user.create({
            data: Object.assign(Object.assign({}, inputUser), { password: hashedPassword }),
        });
        // CREATE PAYLOAD WITH ID AND EMAIL FOR JWT
        const paylaod = {
            id: createdUser.id,
            email: createdUser.email,
        };
        // CREATE JWT
        const token = createJwt(paylaod);
        // SEND USER A TOKEN
        return res.status(201).json({
            message: `User ${createdUser.username} has created`,
            token,
            id: createdUser.id,
        });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.signUp = signUp;
// USER SIGN IN FUNCTION
// CHECK USER CREDENTIONALS
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // GET USER CREDENTIONALS FROM BIDY REQUEST
        const inputUser = signIn_type_1.signInSchema.parse(req.body);
        // FIND USER BY EMAIL
        const signingUser = yield prisma.user.findFirst({
            where: { email: inputUser.email },
        });
        // THROW ERROR IF USER NOT FOUND
        if (!signingUser)
            return res.status(401).json({ message: "No user with such email" });
        // COMPARE USER PASSWORD WITH PASSWORD FROM DB
        const isPassCorrect = yield (0, bcrypt_1.compare)(inputUser.password, signingUser.password);
        // THROW ERROR IF PASSWORD IS INCORRECT
        if (!isPassCorrect)
            return res.status(401).json({ message: "Wrong password" });
        // CREATE PAYLOAD WITH ID AND EMAIL FOR JWT
        const payload = {
            id: signingUser.id,
            email: signingUser.email,
        };
        // CREATE JWT
        const token = createJwt(payload);
        // SEND JWT
        return res
            .status(201)
            .json({ message: "User has sign in", token: token, id: signingUser.id });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.signIn = signIn;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ user: req.user });
    }
    catch (err) {
        const { errorMessage, code } = (0, errorsHandler_1.errorHandler)(err);
        return res.status(code).json({ message: errorMessage });
    }
});
exports.getMe = getMe;
