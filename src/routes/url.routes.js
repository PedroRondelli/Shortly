import { Router } from "express";
import { registerUrl } from "../controllers/url.controllers.js";
import { urlValidation } from "../middlewares/url.middleware.js";

const routers = Router();

routers.post("/urls/shorten", urlValidation, registerUrl);

export default routers;
