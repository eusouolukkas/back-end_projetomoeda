import mongoose from "mongoose";
import { runServer } from "./main/server/express.server";

mongoose.connect(process.env.MONGO_URL || '')
  .then(() => {
    runServer();
  })
  .catch((error) => console.log(error));