import { urlSchema } from "../models/Url.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function urlValidation(req, res, next) {
  const token = req.headers.authorization;
  try {
    if (token) {
      const finalToken = token.replace("Bearer ", "");
      const verified = jwt.verify(finalToken, process.env.JWT_SECRET_KEY);
      console.log(verified);

      if (verified) {
        const validation = urlSchema.validate(req.body, { abortEarly: false });
        if (validation.error) {
          const erros = validation.error.details.map(
            (detail) => detail.message
          );
          return res.status(422).send(erros);
        } else {
          // next();
          return res.send("é válido");
        }
      } else {
        return res.sendStatus(401);
      }
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
}
