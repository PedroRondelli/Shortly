import { Router } from "express";
import { signup, signin } from "../controllers/login.controllers.js";
import {
  loginValidation,
  registerValidation,
} from "../middlewares/registerAndLogin.middleware.js";

const router = Router();

router.post("/signup", registerValidation, signup);
router.post("signin", loginValidation, signin);

export default router;
