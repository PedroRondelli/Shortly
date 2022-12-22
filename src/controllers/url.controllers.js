import { connectionDB } from "../database/db.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function registerUrl(req, res) {
  const shortUrl = nanoid();
  const { url } = res.locals.url;
  const userId = res.locals.url.userId;
  try {
    await connectionDB.query(
      'INSERT INTO urls ("userId","shortUrl","url","visitCount") VALUES ($1,$2,$3,$4)',
      [userId, shortUrl, url, 0]
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
      'SELECT id,"shortUrl",url  FROM urls WHERE id=$1',
      [Number(id)]
    );

    if (rows.length === 1) {
      return res.status(200).send(rows[0]);
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
      const updatedNumberOfVisits = rows[0].visitCount + 1;
      await connectionDB.query(
        'UPDATE urls SET "visitCount"=$1 WHERE "shortUrl"=$2',
        [updatedNumberOfVisits, shortUrl]
      );
      return res.redirect(rows[0].url);
    }
  } catch (error) {
    return res.status(404).send(error.message);
  }
}

export async function deleteUrl(req, res) {
  const token = req.headers.authorization;
  const { id } = req.params;
  try {
    if (token) {
      const finalToken = token.replace("Bearer ", "");
      const verified = jwt.verify(finalToken, process.env.JWT_SECRET_KEY);
      if (verified) {
        const objectFromSelect = await connectionDB.query(
          "SELECT * FROM urls WHERE id=$1",
          [Number(id)]
        );
        if (objectFromSelect.rowCount === 0) {
          return res.sendStatus(404);
        }
        const objectFromSelectUserId = objectFromSelect.rows[0].userId;
        if (objectFromSelectUserId === verified.userId) {
          await connectionDB.query("DELETE FROM urls WHERE id=$1", [
            Number(id),
          ]);
          return res.sendStatus(204);
        } else {
          return res.sendStatus(401);
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
