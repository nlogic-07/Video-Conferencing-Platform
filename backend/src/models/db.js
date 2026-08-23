import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
const mongoURL = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(mongoURL);
}

main()
  .then(() => {
    console.log("Database connected : Connection successfull");
  })
  .catch((err) => {
    console.log("Connection failed", err);
  });
