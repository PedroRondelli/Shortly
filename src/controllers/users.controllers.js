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

        const data = {
          time: Date(),
          userId: rows[0].id,
          name: rows[0].name,
        };

        const token = jwt.sign(data, jwtSecretKey, {
          expiresIn: "2h",
        });

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

export async function getUserProfile(req, res) {
  const token = req.headers.authorization;
  try {
    if (token) {
      const finalToken = token.replace("Bearer ", "");
      const verified = jwt.verify(finalToken, process.env.JWT_SECRET_KEY);

      if (verified) {
        const { userId } = verified;
        const { rows } = await connectionDB.query(
          'SELECT u.id AS id,u.name AS name,SUM(ul."visitCount") AS "visitCount",json_agg(ul.* ORDER BY ul.id ASC) AS "shortenedUrls" FROM users u JOIN urls ul ON u.id=ul."userId" WHERE ul."userId"=$1 GROUP BY u.id',
          [userId]
        );
        if (rows[0]) {
          rows[0].shortenedUrls.forEach((url) => {
            delete url.userId;
            delete url.createdAt;
          });

          return res.send(rows[0]);
        } else {
          const { name } = verified;
          const userProfile = {
            id: userId,
            name: name,
            visitCount: 0,
            shortenedUrls: [],
          };
          return res.send(userProfile);
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

export async function rankUsers(req, res) {
  try {
  } catch (error) {
    return res.send(error.message);
  }
}
