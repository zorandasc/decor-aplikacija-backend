require("express-async-errors"); //ovaj modul ce uhvatiti sve asyn
//promise erore i usmijeriti prema nasem
//error midlwaru na kraju router.js
const mongoose = require("mongoose");
const express = require("express");
const app = express();

//startuj bazu
require("./startup/db")();

//dodaj id validaciju na Joi objekat
require("./startup/joiIdValidation")();

//definisi rute
require("./startup/routes")(app);


const PORT = process.env.PORT || 5000;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
