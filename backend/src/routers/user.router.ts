import express from "express";
import { getUserProfile, addAvatar } from "../controllers/user.controller";
import { upload } from "../utils/multerConfig";
import passport from "passport";
const router = express();

router.get("/:id", getUserProfile);

router.use(passport.authenticate("jwt", { session: false }));

router.post("/changeAvatar", upload.single("image"), addAvatar);

export default router;
