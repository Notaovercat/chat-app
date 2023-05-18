"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServerSchema = exports.createServerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createServerSchema = zod_1.default
    .object({
    name: zod_1.default.string().min(5, "Server name must have more than 5 characters"),
})
    .strict();
exports.updateServerSchema = exports.createServerSchema.partial();
