import express from "express";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());

app.use(userRoutes);

app.listen(port, () => console.log(`Running in port:${port}`));
