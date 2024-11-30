const express = require("express");
const Router = express.Router();
const validate_user = require("../validation/validate_user.js");
const User = require("../model/user.js");
const hashPassword = require("../hash/hashPassword.js");
const {
  create_mail_options,
  transporter,
} = require("../mailer/reg_success_mail.js");
const cloudinary = require("../file_handler/cloudinary.js");
const upload = require("../file_handler/multer.js");
const genToken = require("../token/genToken.js");
const fs = require("fs");

Router.post("/", upload.any("government_ID"),  async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);
  const request_isvalid = validate_user(req.body);
  if (request_isvalid != true)
    return res.status(400).json({ error: true, errMessage: request_isvalid });
  try {
    const user = await User.findOne({email:req.body.email})
    if (user)
      return res.status(400).json({
        error: true,
        errMessage: "Account already exist, please login",
      });

    const uploader = async (path) => await cloudinary.uploads(path, "government_ID");
    let government_ID;
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      government_ID = newPath;
      fs.unlinkSync(path);
    }
    // console.log(government_ID);
    if (government_ID.error)
      return res.status(400).json({
        error: true,
        errMessage:
          "Something went wrong in the server while trying to upload your Government ID, please check passport and try again",
      });

    const password = await hashPassword(req.body.password);

    const user_result = await new User({
      // referral_link: user._id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      government_ID: government_ID.url,
  
      email:req.body.email,
      phone_number: req.body.phone_number,
      country: req.body.country,
      street_address:req.body.street_address,
      city:req.body.street_address,
      password
    });
    await user_result.save();
    const token = genToken(user_result._id);
console.log(user_result)
    transporter.sendMail(
      create_mail_options({
        first_name: user_result.first_name,
        last_name: user_result.last_name,
        reciever: user_result.email,
      }),
      (err, info) => {
        if (err) return console.log(err.message);
        // console.log(info);
        // return res.status(400).json({
        //   error: true,
        //   errMessage: `Encounterd an error while trying to send an email to you: ${err.message}, try again`,
        // });
      },
    );

    res
      .status(200)
      .json({ error: false, message: { user: user_result._id }, token });
    // console.log(user);
    // console.log("success");
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: true, errMessage: error.message });
  }
});
module.exports = Router;


// console.log