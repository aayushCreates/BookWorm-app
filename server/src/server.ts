import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { rateLimit } from 'express-rate-limit';
import authRouter from "./routes/auth.routes";
import expenseRouter from "./routes/expense.routes";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expenses", expenseRouter);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀🚀🚀`);
});