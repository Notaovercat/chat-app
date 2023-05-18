"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.default)();
// router.get("/", getCats);
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.get("/server/:id", category_controller_1.getCatsByServer);
router.get("/:id", category_controller_1.getCatById);
router.post("/", category_controller_1.createCat);
exports.default = router;
