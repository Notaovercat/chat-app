"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createCategorySchema = zod_1.default
    .object({
    name: zod_1.default.string().min(4, "Category name must have more than 5 characters"),
    serverId: zod_1.default.string().uuid().nonempty("Server ID must not be empty"),
})
    .strict();
exports.updateCategorySchema = exports.createCategorySchema.partial();
