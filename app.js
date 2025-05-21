require("dotenv").config();
require("./models/connection");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var apiRouter = require('./routes/api');//api remplace l'appel a index

// var indexRouter = require("./routes/index"); //index n'est plus appelé
var usersRouter = require("./routes/users");
var app = express();
const cors = require("cors");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/api/users", usersRouter); // maj de usersRouter avec le /api
app.use('/api', apiRouter); //   indexRouter est remplacé par apiRouter (voir lg 12) 
module.exports = app;
