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
import { upload } from "../utils/multerConfig";

const router = express();

router.get("/", getServers);
router.get("/id/:id", getServerById);

router.use(passport.authenticate("jwt", { session: false }));
router.post("/", upload.single("image"), createServer);
router.get("/joined", getJoinedServers);
router.post("/join/:joinCode", joinToServer);
router.get("/members/:serverId", getMembers);

export default router;
