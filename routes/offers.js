const express = require("express");
const router = express.Router();

const ROLES_LIST = require("../config/roles_list");
const { offer: Offer, validateOffer } = require("../models/offer");
const verifyJwt = require("../middleware/verifyJwt");
const validateObjectId = require("../middleware/validateObjectId");
const verifyRoles = require("../middleware/verifyRoles");

router.get(
  "/",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User)],
  async (req, res) => {
    const offers = await Offer.find().select("-__v");
    if (!offers) return res.status(204).json({ message: "No Offers found." });
    res.send(offers);
  }
);

router.get(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), validateObjectId],
  async (req, res) => {
    const offer = await Offer.findById(req.params.id).select("-__v").exec();

    if (!offer) return res.status(404).send("Ponuda sa datim id ne postoji.");

    res.send(offer);
  }
);

router.post(
  "/",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin)],
  async (req, res) => {
    //body validation
    const { error } = validateOffer(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const newOffer = new Offer({
      status: req.body.status,
      customer: req.body.customer,
      address: req.body.address,
      pib: req.body.pib,
      mib: req.body.mib,
      contactPerson: req.body.contactPerson,
      contactEmail: req.body.contactEmail,
      contactTel: req.body.contactTel,
      listOfProduct: req.body.listOfProduct,
      avans: req.body.avans,
      totalPrice: req.body.totalPrice,
      dateOfIssue: req.body.dateOfIssue,
      dateOfValidity: req.body.dateOfValidity,
      placeOfIssue: req.body.placeOfIssue,
      methodOfPayment: req.body.methodOfPayment,
      note: req.body.note,
    });

    await newOffer.save();

    res.send(newOffer);
  }
);

router.put(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin), validateObjectId],
  async (req, res) => {
    //validacija id

    let offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).send("Ponuda sa datim id ne postoji.");

    //body validation
    const { error } = validateOffer(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    //promjeni parametre jednog offera
    offer.status = req.body.status;
    offer.customer = req.body.customer;
    offer.address = req.body.address;
    offer.pib = req.body.pib;
    offer.mib = req.body.mib;
    offer.contactPerson = req.body.contactPerson;
    offer.contactEmail = req.body.contactEmail;
    offer.contactTel = req.body.contactTel;
    offer.listOfProduct = req.body.listOfProduct;
    offer.avans = req.body.avans;
    offer.totalPrice = req.body.totalPrice;
    offer.dateOfIssue = req.body.dateOfIssue;
    offer.dateOfValidity = req.body.dateOfValidity;
    offer.placeOfIssue = req.body.placeOfIssue;
    offer.methodOfPayment = req.body.methodOfPayment;
    offer.note = req.body.note;

    await offer.save();

    res.send(offer);
  }
);

router.delete(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin), validateObjectId],
  async (req, res) => {
    const offer = await Offer.findByIdAndRemove({ _id: req.params.id });

    if (!offer) return res.status(404).send("Ponuda sa datim id ne postoji.");

    res.send("Poruda obrisana.");
  }
);

module.exports = router;
