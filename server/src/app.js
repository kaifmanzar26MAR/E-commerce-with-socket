import cors from "cors";
import cookieParser from "cookie-parser";
import homeRouter from "./routes/home.routes.js";
import userRouter from "./routes/user.routes.js";
import sellerRouter from './routes/seller.routes.js';
import prodcutRouter from './routes/product.routes.js';
import bodyParser from "body-parser";
import express from 'express';
import { app } from "./connection/socket.connection.js";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json())
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes declaration
app.use("/api/v1", homeRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/product", prodcutRouter);

export { app };
