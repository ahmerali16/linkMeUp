const mongoose = require('mongoose')

const ispSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNo: String,
    password: String,
    ispName: String,
    cityName: String,
    address: String,
    ispProfile: String,
    OTP: String,
    otpExpiry: Date,
    isVerified: {type: Boolean, default:false},
    isAdminVerified: {type: Boolean, default:false},
    accountDetails: [{
      _id: false,
      bankName: {type:String},
      accountTitle: {type: String},
      accountNumber: {type: String}
    }]
  });
  const ispTable = new mongoose.model("ispTable", ispSchema);

  module.exports = ispTable