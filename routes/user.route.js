const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../models/user.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.post("/register", async (req, res) => {
  const payload = req.body;
  console.log(payload);
  try {
    const userExists = await UserModel.findOne({ email: payload.email });
    if (userExists) return res.json({ message: "User exists, Please login" });
    let hash=bcrypt.hashSync(payload.password,10)
    payload.password=hash
      console.log(hash);
      payload.Password = hash;
      const user = new UserModel(payload);
      await user.save();
      return res
        .status(200)
        .json({ message: "Successfully Registered, Please Login" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
});

userRouter.post("/login", async (req, res) => {
  const payload = req.body;
  try {
    const userExists = await UserModel.findOne({ email: payload.email });
    console.log(userExists);
    if (!userExists)
      return res.json({ message: "User does not exists, Please Register" });
    console.log(payload.password);
    let checkpassword=bcrypt.compareSync(payload.password,userExists.password)
    console.log(checkpassword);
    if(checkpassword){
      const token = jwt.sign(
        { userExists },
        process.env.JWT_SECRET,
        { expiresIn: "1H" }
      );
      res.json({msg:"Logging successful",token})
    }else return res.json('Incorrect Password')
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
});

module.exports = { userRouter };
