var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const mongoose = require("mongoose");
var cors = require("cors");

require("dotenv").config();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, user-access-token, authorization"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  } else {
    next();
  }
});

app.use("/", indexRouter);

app.use("/users", usersRouter);

app.use(express.static(path.join(__dirname, "/public")));

//   regoex.com private cluster
//  mongoose.connect('mongodb://localhost:27017/Women_NFTs')
//    .then(() => console.log('MongoDB server Database Connected'))
//    .catch(err => console.log(err))

mongoose
  .connect(
    "mongodb+srv://data123:data123@cluster0.exouw.mongodb.net/Alians_NFT?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB server Database Connected"))
  .catch((err) => console.log(err));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ message: "Something went wrong!" });
});

module.exports = app;
