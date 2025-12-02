import express from "express";
import router from "./routes/artRouter.js";
import path from "node:path";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(express.static(path.join(import.meta.dirname, "public")));

const server = app.listen(3000, () => console.log("listening"));
