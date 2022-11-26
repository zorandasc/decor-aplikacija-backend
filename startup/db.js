const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const keys = require("../config/keys");

module.exports = function () {
  mongoose
    .connect(keys.mongoURI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Conected to mongodb");
    })
    .catch(() => {
      console.log("Eroro conecting to mongodb");
    });
  //instalisano i dodano kako bi se generisala orderId od 1,2,3 ....
  //za svaki oreder
  autoIncrement.initialize(mongoose.connection);
};
