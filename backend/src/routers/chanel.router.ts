import express from "express";
import passport from "passport";
import { getChanById, getChansByCat } from "../controllers/channels.controller";

const router = express();

// router.get("/", getCats);

router.use(passport.authenticate("jwt", { session: false }));
router.get("/chanel/:id", getChanById);
router.get("/:catId", getChansByCat);
// router.post("/", createChan);

export default router;
