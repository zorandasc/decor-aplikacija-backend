const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJwt = require("../middleware/verifyJwt");
const { user: User, validateUser } = require("../models/user");

//CREATE NEW USER (SIGN UP)
router.post(
  "/",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin)],
  async (req, res) => {
    const { error } = validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const duplicate = await User.findOne({
      username: req.body.username,
    }).exec();

    if (duplicate)
      return res
        .status(409)
        .send("Korisnik aplikacije sa datim imenom vec registrovan.");

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(req.body.password, salt);

      const result = await User.create({
        username: req.body.username,
        password: hashedPwd,
      });

      res
        .status(201)
        .json({ success: `New user ${req.body.username} created!` });
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
