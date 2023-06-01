import express from "express";
import passport from "passport";
import {
  createCat,
  getCatById,
  getCatsByServer,
} from "../controllers/category.controller";

const router = express();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/server/:id", getCatsByServer);
router.get("/:id", getCatById);
router.post("/", createCat);

export default router;
