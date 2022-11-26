const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("../config/corsOptions");
const register = require("../routes/register");
const login = require("../routes/login");
const refresh = require("../routes/refresh");
const logout = require("../routes/logout");
const users = require("../routes/users");
const orders = require("../routes/orders");
const offers = require("../routes/offers");
const logger = require("../middleware/logEvents");
const error = require("../middleware/error");

module.exports = function (app) {
  if (process.env.NODE_ENV !== "production") {
    app.use(logger);
  }
  // Cross Origin Resource Sharing
  app.use(cors(corsOptions));

  // built-in middleware for json
  app.use(express.json());

  //middleware for cookies
  app.use(cookieParser());

  app.use("/api/login", login); // get accesss/refresh token
  app.use("/api/refresh", refresh); //refresh for accesstoken
  app.use("/api/logout", logout); //delete refreshtoken from db
  //app.use(verifyJwt); //verify access token and protect everyrhing under
  app.use("/api/register", register); //register new user
  app.use("/api/users", users);
  app.use("/api/orders", orders);
  app.use("/api/offers", offers);
  app.use(error); //middlewarre for catching promise rejections
};
