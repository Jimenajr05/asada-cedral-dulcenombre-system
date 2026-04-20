import express from "express";
import { getAll, create, remove } from "../controllers/transparencia.controller.js";
import upload from "../middlewares/upload.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", auth, upload.single("archivo"), create);
router.delete("/:id", auth, remove);

export default router;