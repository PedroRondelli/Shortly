import { Router } from "express";
import {
  signup,
  signin,
  getUserProfile,
  rankUsers,
} from "../controllers/users.controllers.js";
import {
  loginValidation,
  registerValidation,
} from "../middlewares/registerAndLogin.middleware.js";

const router = Router();

router.post("/signup", registerValidation, signup);
router.post("/signin", loginValidation, signin);
router.get("/users/me", getUserProfile);
router.get("/ranking", rankUsers);
export default router;
