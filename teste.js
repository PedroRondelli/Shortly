import { connectionDB } from "./src/database/db.js";

async function teste() {
  try {
    const molde = await connectionDB.query(
      'SELECT u.id AS id,u.name AS name,SUM(ul."visitCount") AS "visitCount",json_agg(ul.*) AS "shortenedUrls" FROM users u JOIN urls ul ON u.id=ul."userId" WHERE ul."userId"=1 GROUP BY u.id'
    );
    console.log(molde);
  } catch (error) {
    console.log(error.message);
  }
}

teste();
