require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

const authentication = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) return res.status(401).json({ message: "Please Login" });
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, docode) => {
      if (err) {
        // console.log(err);
        if (err.message === "jwt expired") {
          return res
            .status(440)
            .json({ error: "Session expired, Please Login" });
        }
        return res.status(404).json({ error: "Something went wrong" });
      }
      console.log(docode.userExists.email);
      const userExists = await UserModel.findOne({ email: docode.userExists.email });
      if (!userExists)return res.json({ message: "User does not exists, Please Register" });
      req.email= docode.userExists.email;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { authentication };
