"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const server_router_1 = __importDefault(require("./routers/server.router"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const chanel_router_1 = __importDefault(require("./routers/chanel.router"));
const category_router_1 = __importDefault(require("./routers/category.router"));
const passport_1 = __importDefault(require("passport"));
const jwtConfig_1 = require("./utils/jwtConfig");
const app = (0, express_1.default)();
// MIDDLEWARES
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// AUTH
app.use(passport_1.default.initialize());
passport_1.default.use(jwtConfig_1.jwtStrategy);
// ROUTES
app.use("/auth", auth_router_1.default);
app.use("/servers", server_router_1.default);
app.use("/categories", category_router_1.default);
app.use("/user", user_router_1.default);
app.use("/chanels", chanel_router_1.default);
exports.default = app;
