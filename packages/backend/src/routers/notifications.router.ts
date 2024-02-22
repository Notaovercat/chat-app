import express from "express";
import {
  // handleNotification,
  handleSubscribe,
} from "../controllers/notifications.controller";
import passport from "passport";

const router = express();

router.post("/subscribe", handleSubscribe);

router.use(passport.authenticate("jwt", { session: false }));

// router.get("/send", handleNotification);

export default router;
