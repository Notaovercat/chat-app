import express from "express";
import passport from "passport";
import {
  createServer,
  getServerById,
  getServers,
  joinToServer,
  getJoinedServers,
} from "../controllers/server.controller";

const router = express();

router.get("/", getServers);
router.get("/id/:id", getServerById);

router.use(passport.authenticate("jwt", { session: false }));
router.post("/", createServer);
router.get("/joined", getJoinedServers);

export default router;
