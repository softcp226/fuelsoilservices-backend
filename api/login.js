const express = require("express");
const Router = express.Router();
const User = require("../model/user.js");
const genToken = require("../token/genToken");
const verifyPassword = require("../hash/comparePassword.js");
const validateLogin = require("../validation/validateLogin.js");

Router.post("/", async (req, res) => {
  try {

  // console.log(req.body);
  const isvalid = validateLogin(req.body);
  if (isvalid != true)
    return res.status(400).json({ error: true, errMessage: isvalid });
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .json({ error: true, errMessage: "invalid Email or Password " });
  console.log("use", user);

        // console.log("verifying...");

    const passwordIsverified = await verifyPassword(
      req.body.password,
      user.password,
    );
    // console.log("passwordisverified",passwordIsverified);

    if (passwordIsverified != true)
      return res
        .status(400)
        .json({ error: true, errMessage: "invalid Email or password " });

   
    const token = genToken(user._id);


    res.status(200).json({
      error: false,
      message: { user: user._id },
      token,
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: true, errMessage: err.message });
  }
});

module.exports = Router;

