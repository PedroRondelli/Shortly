import { Router } from "express";
import { getUrlById, registerUrl } from "../controllers/url.controllers.js";
import { urlValidation } from "../middlewares/url.middleware.js";

const routers = Router();

routers.post("/urls/shorten", urlValidation, registerUrl);

routers.get("/urls/:id",getUrlById);

export default routers;
