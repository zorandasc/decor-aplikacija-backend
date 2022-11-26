const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const { user: User } = require("../models/user");

router.get("/", async (req, res) => {
  //provjeri da li request ima odgovarajuci cookie
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  let foundUser = await User.findOne({ refreshToken }).exec();

  //detected refresh token reuse,we receive cooke,
  //but not finded user, that mean that te refreshtoken
  //was previsusly invalidated
  if (!foundUser) return res.sendStatus(403); //Forbidden

  //verifikuj vjerodostojnost refresh tokena
  jwt.verify(refreshToken, keys.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);

    const accessToken = foundUser.generateAccessToken();

    res.json({ accessToken });
  });
});

module.exports = router;
