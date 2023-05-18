"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const channels_controller_1 = require("../controllers/channels.controller");
const router = (0, express_1.default)();
// router.get("/", getCats);
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.get("/chanel/:id", channels_controller_1.getChanById);
router.get("/:catId", channels_controller_1.getChansByCat);
// router.post("/", createChan);
exports.default = router;
