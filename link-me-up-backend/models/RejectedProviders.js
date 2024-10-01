const mongoose = require('mongoose')

const rejectedISPSchema = new mongoose.Schema({
    adminID: {type:mongoose.Schema.Types.ObjectId, ref:"adminTable"},
    ispID: {type:mongoose.Schema.Types.ObjectId, ref:"ispTable"},
    ispName: {type:mongoose.Schema.Types.String, ref:"ispTable"},
    ispProfile: {type:mongoose.Schema.Types.String, ref:'ispTable'},
    remarks: String
  })
const rejectedISPTable = new mongoose.model("rejectedISPTable", rejectedISPSchema);

module.exports = rejectedISPTable