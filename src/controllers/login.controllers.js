import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function signup(req, res) {
  const { email, name, password } = res.locals.user;
  const encryptPassword = bcrypt.hashSync(password, 10);
  try {
    const { rowCount } = await connectionDB.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (rowCount === 0) {
      await connectionDB.query(
        "INSERT INTO users (name,email,password) VALUES($1,$2,$3)",
        [name, email, encryptPassword]
      );
      return res.sendStatus(201);
    } else {
      return res.sendStatus(409);
    }
  } catch (error) {
    return res.send(error.message);
  }
}

export async function signin(req, res) {
  const { email, password } = res.locals.login;
  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (rows.length === 1) {
      const correctPassword = bcrypt.compareSync(password, rows[0].password);
      if (correctPassword) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        console.log(rows[0].id);
        const data = {
          time: Date(),
          userId: rows[0].id,
        };

        const token = jwt.sign(data, jwtSecretKey);

        return res.send(token).status(200);
      } else {
        return res.sendStatus(401);
      }
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    res.send(error.message);
  }
}
