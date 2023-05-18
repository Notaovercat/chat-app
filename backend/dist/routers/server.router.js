"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const server_controller_1 = require("../controllers/server.controller");
const router = (0, express_1.default)();
router.get("/", server_controller_1.getServers);
router.get("/id/:id", server_controller_1.getServerById);
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.post("/", server_controller_1.createServer);
router.get("/joined", server_controller_1.getJoinedServers);
exports.default = router;
