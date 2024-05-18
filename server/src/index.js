import dotenv from "dotenv";
import { app } from "./app.js";

import connectDB from "./DB/index.js";
import { server } from "./connection/socket.connection.js";

dotenv.config({
  path: "server/.env",
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!!", err);
  });

