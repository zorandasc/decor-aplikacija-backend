//ovaj midleware ide poslje authorizacija midleware
//400 bad request
//401 unaotharized
//403 forbiden
module.exports = function (req, res, next) {
  //AFTER AUTHORIZACIJE PA POSTOJI req.user
  if (!req.user.isAdmin)
    return res.status(403).send("😱 Access denied. Niste Autorizovani.");
  next(); // TO ROUTE HANDLER
};
