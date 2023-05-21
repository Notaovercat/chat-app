import express from "express";
import passport from "passport";
import {
  getChanById,
  getChansByCat,
  createChan,
} from "../controllers/channels.controller";

const router = express();

router.use(passport.authenticate("jwt", { session: false }));
router.post("/", createChan);
router.get("/chanel/:id", getChanById);
router.get("/:catId", getChansByCat);

export default router;
