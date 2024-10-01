const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNo: Number,
    password: String,
    OTP: String,
    otpExpiry: Date,
    adminProfile: String,
    isVerified: {type: Boolean, default: false},
    secretKey: String,
  });
const adminTable = new mongoose.model("adminTable", adminSchema);

module.exports  = adminTable