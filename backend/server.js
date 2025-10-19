import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.listen(4000, () =>  {
    connectDB();
    console.log("Server start at http://localhost:4000 ");
});

