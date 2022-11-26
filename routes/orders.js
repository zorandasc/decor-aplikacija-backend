const express = require("express");
const router = express.Router();

const ROLES_LIST = require("../config/roles_list");
const { order: Order, validateOrder } = require("../models/order");
const verifyJwt = require("../middleware/verifyJwt");
const validateObjectId = require("../middleware/validateObjectId");
const verifyRoles = require("../middleware/verifyRoles");

router.get(
  "/",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User)],
  async (req, res) => {
    const orders = await Order.find().select("-__v");
    if (!orders) return res.status(204).json({ message: "No Orders found." });
    res.send(orders);
  }
);

router.get(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), validateObjectId],
  async (req, res) => {
    const order = await Order.findById(req.params.id).select("-__v").exec();

    if (!order)
      return res.status(404).send("Narudžbina sa datim id ne postoji.");

    res.send(order);
  }
);

router.post(
  "/",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin)],
  async (req, res) => {
    //body validation

    const { error } = validateOrder(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const newOrder = new Order({
      status: req.body.status,
      developer: req.body.developer,
      customer: req.body.customer,
      address: req.body.address,
      listOfProduct: req.body.listOfProduct,
      avans: req.body.avans,
      totalPrice: req.body.totalPrice,
      deliveryTime: req.body.deliveryTime,
      orderDate: req.body.orderDate,
      note: req.body.note,
    });

    await newOrder.save();

    res.status(201).send(newOrder);
  }
);

router.put(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin), validateObjectId],
  async (req, res) => {
    //validacija id

    let order = await Order.findById(req.params.id).exec();
    if (!order)
      return res.status(404).send("Porudžbina sa datim id ne postoji.");

    //body validation
    const { error } = validateOrder(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    //promjeni parametre jednog ordera
    order.status = req.body.status;
    order.developer = req.body.developer;
    order.customer = req.body.customer;
    order.address = req.body.address;
    order.listOfProduct = req.body.listOfProduct;
    order.avans = req.body.avans;
    order.totalPrice = req.body.totalPrice;
    order.orderDate = req.body.orderDate;
    order.deliveryTime = req.body.deliveryTime;
    order.note = req.body.note;

    const result = await order.save();

    res.send(result);
  }
);

router.delete(
  "/:id",
  [verifyJwt, verifyRoles(ROLES_LIST.Admin), validateObjectId],
  async (req, res) => {
    const order = await Order.findByIdAndRemove({ _id: req.params.id });

    if (!order)
      return res
        .status(404)
        .send(`Porudžbina sa id: ${req.params.id} ne postoji.`);

    res.send(`Porudžbina sa id: ${req.params.id} obrisana.`);
  }
);

module.exports = router;
