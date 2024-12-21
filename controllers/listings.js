/** @format */

const Listing = require("../models/listings");

module.exports.index = async (req, res) => {
  const listings = await Listing.find();
  res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(`${id}`)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, filename);
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { url, filename };
  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditFrom = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(`${id}`);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.UpadateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true }
  );
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
