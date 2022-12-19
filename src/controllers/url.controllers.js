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

export async function getUrlById(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM urls WHERE id=$1",
      [Number(id)]
    );
    if (rows.length === 1) {
      const responseObject = {
        id: rows[0].id,
        shortUrl: rows[0].shortUrl,
        url: rows[0].bigUrl,
      };
      return res.status(200).send(responseObject);
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    return res.send(error.message);
  }
}

export async function redirectUser(req, res) {
  const { shortUrl } = req.params;
  try {
    const { rows } = await connectionDB.query(
      'SELECT * FROM urls WHERE "shortUrl"=$1',
      [shortUrl]
    );
    if (rows.length === 0) {
      return res.sendStatus(404);
    } else {
      
      return res.redirect(rows[0].bigUrl);
    }
  } catch (error) {
    return res.status(404).send(error.message);
  }
}
