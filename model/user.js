const mongoose = require("mongoose");
const connect = require("./dbConnector.js");
connect("connected to user database");
require("./user");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  government_ID: {
    type: String,
    required: true,
  },

 country: {
    type: String,
    required: true,
  },
  
  street_address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);
module.exports = User;
