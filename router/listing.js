/** @format */

const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings");
const { isLogedIn, isOwner, validateListing } = require("../middleware");
const router = express.Router();
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
//conbining post for(create listing) and get for(index.ejs)
router
  .route("/")
  .get(wrapAsync(listingController.index)) //show all listing route
  .post(
    isLogedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  ); // Create new listing rout

//create new listing rout to serve form for new listing
router.get("/new", isLogedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings)) //show rout to display individual listing
  .delete(isLogedIn, isOwner, wrapAsync(listingController.destroyListing)) //destroy rout
  .put(
    isLogedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.UpadateListing)
  ); // update route //edit rout making changes in database

//edit rout for listing form
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingController.renderEditFrom)
);

module.exports = router;
