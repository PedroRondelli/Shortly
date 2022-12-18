import joi from "joi";

export const registerSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
  confirmPassword: joi.any().equal(joi.ref("password")).required(),
});
