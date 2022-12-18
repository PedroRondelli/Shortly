import { urlSchema } from "../models/Url.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function urlValidation(req, res, next) {
  const token = req.headers.authorization;
  const finalToken = token.replace("Bearer ", "");
  const verified = jwt.verify(finalToken, process.env.JWT_SECRET_KEY);
  if (verified) {
    const validation = urlSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
      const erros = validation.error.details.map((detail) => detail.message);
      return res.send(erros).status(422);
    }
    next();
  } else {
    return res.sendStatus(401);
  }
}
