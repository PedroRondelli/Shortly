import { connectionDB } from "../database/db.js";
import { nanoid } from "nanoid";

export async function registerUrl(req, res) {
  const shortUrl = nanoid();
  const bigUrl = res.locals.url.url;
  const userId = res.locals.url.userId;
  try {
    await connectionDB.query(
      'INSERT INTO urls ("userId","shortUrl","bigUrl") VALUES ($1,$2,$3)',
      [userId, shortUrl, bigUrl]
    );
    return res.status(201).send({ shortUrl });
  } catch (error) {
    return res.send(error.message);
  }
}
