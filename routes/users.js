const express = require("express");
const router = express.Router();

const ROLES_LIST = require("../config/roles_list");
const verifyJwt = require("../middleware/verifyJwt");
const validateObjectId = require("../middleware/validateObjectId");
const verifyRoles = require("../middleware/verifyRoles");
const { user: User } = require("../models/user");

router.get(
  "/",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin)],
  async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ message: "No users found" });
    res.send(users);
  }
);

router.get(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin), validateObjectId],
  async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
      return res
        .status(204)
        .json({ message: `User ID ${req.params.id} not found` });
    }
    res.json(user);
  }
);

router.get("/me", verifyJwt, async (req, res) => {
  //posto smo prosli aurhorizaciju preko auth midlewarea
  //u req objektu sada imamo user object, req.user
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(204).json({ message: "No user found" });
  res.send(user);
});

router.delete(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin), validateObjectId],
  async (req, res) => {
    const user = await User.findByIdAndRemove({ _id: req.params.id });

    if (!user)
      return res
        .status(404)
        .send("Korisnik aplikacije sa datim id ne postoji.");

    res.send("Korisnik aplikacije obrisan.");
  }
);

module.exports = router;
