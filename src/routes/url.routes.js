import { Router } from "express";
import { urlValidation } from "../middlewares/url.middleware.js";

const routers = Router();

routers.post("/urls/shorten", urlValidation);

export default routers;
