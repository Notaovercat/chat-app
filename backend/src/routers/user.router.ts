import express from "express";
import { getUserProfile } from "../controllers/user.controller";
const router = express();

router.get("/:id", getUserProfile);

export default router;
