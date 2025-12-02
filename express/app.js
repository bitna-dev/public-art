import express from "express";
import router from "./routes/artRouter.js";
import path from "node:path";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(express.static(path.join(import.meta.dirname, "public")));

// when landed not /api/v1
app.use("/*path", (req, res) => {
	res.sendFile(path.join(import.meta.dirname, "public", "index.html"));
});

const server = app.listen(3000, () => console.log("listening"));
