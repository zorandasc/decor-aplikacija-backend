//AUTORIZACIJA
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    //req.roles dobijeno od verifyJWT
    if (!req?.roles) return res.sendStatus(401); //NOT AUTORHIZED
    const rolesArray = [...allowedRoles];
    //console.log("ALLOWED ROLES", rolesArray);
    //console.log("SENDED ROLES", req.roles);

    //mapira req.roles u array of [false, true]
    //pronaci bar jedan true
    const matchedRoles = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!matchedRoles) return res.sendStatus(401); //NOT AUTORHIZED
    next();
  };
};

module.exports = verifyRoles;
