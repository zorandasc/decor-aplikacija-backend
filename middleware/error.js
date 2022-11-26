//for catching promise rejections in api request response
module.exports = function (err, req, res, next) {
  //err object that we catch somewere in pour aplication
  console.log("ERROR IN error.js midleware", err);
  res.status(500).send(`Something failed on server: ${err.message}`);
};
