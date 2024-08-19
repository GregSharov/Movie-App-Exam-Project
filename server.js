import express from "express";
import fs from "fs";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`Server successfully runs on port ${port}...`);
});