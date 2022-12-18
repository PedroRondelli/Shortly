import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";

export default async function signup(req, res) {
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
