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
exports.jwtStrategy = void 0;
const client_1 = require("@prisma/client");
const passport_jwt_1 = require("passport-jwt");
const prisma = new client_1.PrismaClient();
// EXLUDE FIELDS FROM PRISMA OBJECT
function exclude(user, keys) {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
// OPTIONS FOR STRATEGY
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "secret",
};
// STRATEGY
exports.jwtStrategy = new passport_jwt_1.Strategy(opts, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield prisma.user.findUniqueOrThrow({
            where: { id: payload.id },
        });
        const user = exclude(foundUser, ["password"]);
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (err) {
        return done(err, false);
    }
}));
