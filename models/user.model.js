const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String
},{versionKey:false});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
