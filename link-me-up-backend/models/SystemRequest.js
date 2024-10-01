const mongoose = require('mongoose');

const systemRequestSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "userTable", required: true },
  number_of_systems: Number,
  address: String,
  specifications: [String],
  ispDetails: [{
      _id: false,
      ispID: { type: mongoose.Schema.Types.ObjectId, ref: "ispTable"},
      price: { type: Number},
      remarks: { type: String }
    }],
});

const SystemRequest = mongoose.model("SystemRequest", systemRequestSchema);

module.exports = SystemRequest;
