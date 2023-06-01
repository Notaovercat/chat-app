import { signIn, signUp, getMe } from "../controllers/auth.controller";
import express from "express";
import passport from "passport";

const router = express();

router.post("/signUp", signUp);
router.post("/signIn", signIn);

router.use(passport.authenticate("jwt", { session: false }));

router.get("/getme", getMe);

export default router;
