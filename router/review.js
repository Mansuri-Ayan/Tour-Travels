/** @format */

const express = require("express");
const Listing = require("../models/listings");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLogedIn, isAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });
const reviewControllers = require("../controllers/reviews");

// Reviews Post rout
router.post(
  "/",
  validateReview,
  isLogedIn,
  wrapAsync(reviewControllers.createReview)
);

// Delete Review rout
router.delete(
  "/:reviewId",
  isLogedIn,
  isAuthor,
  wrapAsync(reviewControllers.destroyReview)
);

module.exports = router;
