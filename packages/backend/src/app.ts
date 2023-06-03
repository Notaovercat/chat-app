import cors from "cors";
import express, { Express } from "express";
import morgan from "morgan";
import authRouter from "./routers/auth.router";
import serverRouter from "./routers/server.router";
import userRouter from "./routers/user.router";
import chanelRouter from "./routers/chanel.router";
import categoryRouter from "./routers/category.router";
import passport from "passport";
import { jwtStrategy } from "./utils/jwtConfig";
import path from "path";

const app: Express = express();

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN as string }));
app.use(express.static(path.join(__dirname, "../public")));
// AUTH
app.use(passport.initialize());
passport.use(jwtStrategy);

// ROUTES
app.use("/auth", authRouter);
app.use("/servers", serverRouter);
app.use("/categories", categoryRouter);
app.use("/user", userRouter);
app.use("/chanels", chanelRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});

export default app;
