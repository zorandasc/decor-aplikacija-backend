const mongoose = require("mongoose");
const Joi = require("joi");
const autoIncrement = require("mongoose-auto-increment");

const statuses = ["Active", "Ready", "Finished"];
const developers = ["Decorwood", "Svadbenicvet"];

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: statuses,
    default: "Active",
    required: true,
  },
  developer: {
    type: String,
    enum: developers,
    default: "decorwood",
    required: true,
  },
  listOfProduct: {
    type: Array,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "Mora biti bar jedan proizvod",
    },
  },
  avans: {
    type: Number,
    default: 0,
  },

  totalPrice: {
    type: Number,
    default: 0,
    //min: 0,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryTime: {
    type: Date,
  },
  customer: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
    maxlength: 500,
  },
  note: {
    type: String,
    maxlength: 1000,
    default: "",
  },
});

//generise orderId za svaki novi order
orderSchema.plugin(autoIncrement.plugin, {
  model: "Order",
  field: "orderId",
  startAt: 1,
  incrementBy: 1,
});

const Order = mongoose.model("Order", orderSchema);

//validacija dolaznog proizvoda unutar liste proizvoda
//unutar jedne porudbine
function validateOrder(order) {
  let product = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().max(50).required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(1).required(),
  });

  const schema = Joi.object({
    status: Joi.string()
      .valid(...statuses)
      .required(),
    developer: Joi.string()
      .valid(...developers)
      .required(),
    customer: Joi.string().min(2).max(50).required(),
    address: Joi.string().max(500).required(),
    listOfProduct: Joi.array().items(product).min(1).required(),
    avans: Joi.number().min(0),
    totalPrice: Joi.number().min(0).required(),
    orderDate: Joi.date().required(),
    deliveryTime: Joi.date().required(),
    note: Joi.string().max(1000).allow(""),
    orderId: Joi.number(),
  });

  return schema.validate(order);
}

exports.order = Order;
exports.validateOrder = validateOrder;
