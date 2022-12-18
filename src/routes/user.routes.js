import { Router } from "express";
import signup from "../controllers/login.controllers.js";
import { registerValidation } from "../middlewares/registerValidation.middleware.js";

const router = Router();

router.post("/signup", registerValidation, signup);

export default router;
