const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

//AUTENTIFIKACIJA
//verify acces token to protect certain routes
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  //console.log("verifyJwt midleware", token);
  jwt.verify(token, keys.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token FORBIDEN
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJwt;
