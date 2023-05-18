"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.default)();
router.post("/signUp", auth_controller_1.signUp);
router.post("/signIn", auth_controller_1.signIn);
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.get("/getme", auth_controller_1.getMe);
exports.default = router;
