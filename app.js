/** @format */
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./router/user.js");
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //these information will be in seconds
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: false,

  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, //these information will be in miliseconds
    httpOnly: true,
  },
};

const port = 3000;

//seting view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then((res) => {
    console.log("connected succsessfuly");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req, res) => {
//   let fakeuser = new User({
//     email: "student@gamil.com",
//     username: "deltastudent",
//   });
//   let newUser = await(User.register(fakeuser, "helloworld"));
//   res.send(newUser);
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  console.dir(err);
  let { status = 500, message = "SOMETHING WENT WRONG!" } = err;
  res.status(status).render("error.ejs", { err });
});

//constantly listining to upcoming requests
app.listen(port, () => {
  // console.log(`port is listining on => http://localhost:3000/listings`);
  console.log(`port is listining on => ${port}`);
});
