/** @format */

const Listing = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let reviews = new Review(req.body.review);
  reviews.author = req.user._id;
  listing.reviews.push(reviews);
  await reviews.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
