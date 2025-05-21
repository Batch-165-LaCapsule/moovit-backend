// import apiRouter from './routes/index.js';


require("dotenv").config();
require("./models/connection");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");


var apiRouter = require('./routes/api');

var indexRouter = require("./routes/index");
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
app.use("/api/users", usersRouter);
app.use('/api', apiRouter);
// app.use('/api', apiRouter)
// app.use('/api', indexRouter)
module.exports = app;
