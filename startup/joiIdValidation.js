const Joi = require("joi");

module.exports = function () {
  //podesimo funkciju require("joi-objectid") kao properti od global
  // Joi objekta pa mozemo koristiti svugdije
  Joi.objectId = require("joi-objectid");
};
