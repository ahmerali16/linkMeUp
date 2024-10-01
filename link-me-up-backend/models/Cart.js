const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "userTable" },
    ispID: { type: mongoose.Schema.Types.ObjectId, ref: "ispTable" },
    packageDetails: [{
      packageID: { type: mongoose.Schema.Types.ObjectId, ref: "packagesTable" },
      connectionAddress: String,
      isApproval: {type: Boolean, default:false},
    }]
  });
  const cartTable = new mongoose.model("cartTable", cartSchema);

  module.exports = cartTable