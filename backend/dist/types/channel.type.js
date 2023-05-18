"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChanelSchema = exports.createChanelSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createChanelSchema = zod_1.default
    .object({
    name: zod_1.default.string().min(4, "Chanel name must have more than 5 characters"),
    categoryId: zod_1.default.string().uuid().nonempty("Category ID must not be empty"),
})
    .strict();
exports.updateChanelSchema = exports.createChanelSchema.partial();
