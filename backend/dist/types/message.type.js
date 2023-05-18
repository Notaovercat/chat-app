"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessageSchema = exports.createMessageSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createMessageSchema = zod_1.default
    .object({
    content: zod_1.default.string(),
    channelId: zod_1.default.string().uuid().nonempty("channel ID must not be empty"),
})
    .strict();
exports.updateMessageSchema = exports.createMessageSchema.partial();
