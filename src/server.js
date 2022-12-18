import express from "express";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.routes.js";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());

app.use(userRoutes);
app.use(urlRoutes);

app.listen(port, () => console.log(`Running in port:${port}`));
