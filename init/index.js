require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const mongoUrl = process.env.ATLASDB_URL;

// Credentials for the user that owns the sample listings
const SEED_USERNAME = process.env.SEED_USERNAME || "demo";
const SEED_EMAIL = process.env.SEED_EMAIL || "demo@stayease.com";
const SEED_PASSWORD = process.env.SEED_PASSWORD || "demo1234";

const getSeedOwner = async () => {
  let owner = await User.findOne({ username: SEED_USERNAME });
  if (!owner) {
    owner = await User.register(
      new User({ username: SEED_USERNAME, email: SEED_EMAIL }),
      SEED_PASSWORD
    );
    console.log(`Created seed user "${SEED_USERNAME}" (password: ${SEED_PASSWORD})`);
  }
  return owner;
};

const initDB = async () => {
  await mongoose.connect(mongoUrl);
  console.log("connected to DB");

  const owner = await getSeedOwner();
  const oldReviews = await Listing.distinct("reviews");
  await Review.deleteMany({ _id: { $in: oldReviews } });
  await Listing.deleteMany({});

  // data.js is an Extended JSON export ({ $oid: ... }), so keep only plain fields.
  // Sample reviews are not included in the data, so their references are dropped.
  const listings = initData.data.map(
    ({ _id, reviews, owner: _owner, __v, ...obj }) => ({
      ...obj,
      _id: _id && _id.$oid ? _id.$oid : _id,
      owner: owner._id,
    })
  );

  await Listing.insertMany(listings);
  console.log(`DB is initialized with ${listings.length} listings`);
};

initDB()
  .catch((error) => {
    console.error("Error initializing DB:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
