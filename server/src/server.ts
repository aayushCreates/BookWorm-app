import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bookRouter from "./routes/book.routes";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", bookRouter);

const MONGO_URI = process.env.MONGO_URI as string;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB 🍃");
    const port = process.env.PORT || 5050;
    app.listen(port, () => {
      console.log(`Server is running on port ${port} 🚀🚀🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
