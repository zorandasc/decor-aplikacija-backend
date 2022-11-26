const express = require("express");
const router = express.Router();

const { user:User } = require("../models/user");

//on client also delete accestoken
router.get("/", async (req, res) => {
  //check if coookie exsist
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  //provjeri da li je token u requestu isti kao u bazi za tog korisnika
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    //nema refresh token u bazi samo obrisis cookkie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }
  //obrisi refreshtoken iz baze
  foundUser.refreshToken = "";
  const result = await foundUser.save();

  //secure znaci da only serve with https
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
});

module.exports = router;
