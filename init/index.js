/** @format */

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => {
    console.log("connected succsessfuly");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({})
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6756f55f55ab65827fb58210",
  }));
  await Listing.insertMany(initData.data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("data was inialized");
};
initDB();
