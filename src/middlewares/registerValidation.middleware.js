import { registerSchema } from "../models/Register.js";
import { connectionDB } from "../database/db.js";

export function registerValidation(req, res, next) {
  const validation = registerSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    res.send(erros).status(422);
  }

  res.locals.user = req.body;

  next();
}
