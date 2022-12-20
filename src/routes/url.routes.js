import { Router } from "express";
import {
  deleteUrl,
  getUrlById,
  redirectUser,
  registerUrl,
} from "../controllers/url.controllers.js";
import { urlValidation } from "../middlewares/url.middleware.js";

const routers = Router();

routers.post("/urls/shorten", urlValidation, registerUrl);

routers.get("/urls/:id", getUrlById);

routers.get("/urls/open/:shortUrl", redirectUser);

routers.delete("/urls/:id",deleteUrl);

export default routers;
