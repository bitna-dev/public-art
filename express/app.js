import express from "express";
import router from "./routes/artRouter.js";

const app = express();
const server = app.listen(3000, () => console.log("listening"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(express.static("public"));
