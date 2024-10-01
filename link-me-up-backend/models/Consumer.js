const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNo: String,
    ConsumerProfile: String,
    OTP: String,
    otpExpiry: Date,
    isVerified: {type: Boolean, default: false},
  });
  
  const userTable = new mongoose.model("userTable", userSchema);

module.exports = userTable