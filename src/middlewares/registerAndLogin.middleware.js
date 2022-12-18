import { registerSchema } from "../models/Register.js";
import { loginSchema } from "../models/Login.js";

export function registerValidation(req, res, next) {
  const validation = registerSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    res.send(erros).status(422);
  }

  res.locals.user = req.body;

  next();
}

export function loginValidation(req, res, next) {
  const validation = loginSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const erros = validation.error.details.map((detail) => detail.message);
    res.status(422).send(erros);
  }

  res.locals.login = req.body;

  next();
}