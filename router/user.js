/** @format */

const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router = express.Router({ mergeParams: true });
const userController = require("../controllers/users");

router
  .route("/signup")
  .get(userController.rendersignupForm) //for signup form
  .post(wrapAsync(userController.signup)); //for signUP rout

router
  .route("/login")
  .get(userController.renderloginForm) //for login form
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  ); //for login

//for log out
router.get("/logout", userController.logout);

module.exports = router;
