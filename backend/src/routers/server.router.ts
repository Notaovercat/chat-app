import express from "express";
import passport from "passport";
import {
  createServer,
  getServerById,
  getServers,
  joinToServer,
  getJoinedServers,
  getMembers,
} from "../controllers/server.controller";

const router = express();

router.get("/", getServers);
router.get("/id/:id", getServerById);

router.use(passport.authenticate("jwt", { session: false }));
router.post("/", createServer);
router.get("/joined", getJoinedServers);
router.post("/join/:joinCode", joinToServer);
router.get("/members/:serverId", getMembers);

export default router;
