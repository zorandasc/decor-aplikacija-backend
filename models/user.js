const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const keys = require("../config/keys");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024, //HASHED PASSWORD TO MONGODB
  },
  roles: {
    User: {
      type: Number,
      default: 1981,
    },
    Admin: Number,
  },
  isAdmin: Boolean,
  refreshToken: String,
});

//INFORMATION EXPERT PRINCIPLE,
//USER OBJECT TREBA DA ZNA const token=user.generateAuthToken();
//nemozemo ovdije staviti arrow function zbog this.
//old generateAuthToken kode not used enee more
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isAdmin: this.isAdmin,
    },
    keys.jwtPrivateKey,
    {
      expiresIn: "15m", //60 sekundi * 30 minuta, 1d 1 dan
    }
  );
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      UserInfo: {
        username: this.username,
        roles: Object.values(this.roles).filter(Boolean),
      },
    },
    keys.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ username: this.username }, keys.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
mongoose.models = {};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

exports.user = User;
exports.validateUser = validateUser;
