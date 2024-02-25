import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { router } from "./router/router.ts";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use("/x-clone", router);
const PORT = process.env.PORT || 8888;
const mongodbUrl =
  "mongodb+srv://nikitars7:6hbxM0dYc2LZJKdg@cluster0.iqljoxf.mongodb.net/";

const start = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    app.listen(PORT, () => {
      console.log("SERVER WORKS");
    });
  } catch (e) {
    console.log(e);
  }
};

start();
