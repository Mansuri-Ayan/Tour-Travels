 /** @format */

const Listing = require("./models/listings");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // redirect url save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You myst be loggedIn!");
    res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//middle for checking true owner of listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//middleware for cheking true owner of review
module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this Review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// provied validation for server through Joi
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
