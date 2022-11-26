const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { user:User, validateUser } = require("../models/user");

router.post("/", async (req, res) => {
  //validacija broja karaktera i struktura

  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // evaluate username
  const foundUser = await User.findOne({ username: req.body.username }).exec();
  if (!foundUser) return res.status(401).send("Ne validan username ili password.");

  // evaluate password
  const match = await bcrypt.compare(req.body.password, foundUser.password);

  if (match) {
    const accessToken = foundUser.generateAccessToken();

    const refreshToken = foundUser.generateRefreshToken();

    //saving refreshtoken with current user
    foundUser.refreshToken = refreshToken;

    await foundUser.save();

    // Creates Secure Cookie with new refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.status(401).send("Ne validan username ili password.");
  }
});

module.exports = router;
