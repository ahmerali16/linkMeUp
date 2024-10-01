const mongoose = require('mongoose')

const rejectedPackageSchema = new mongoose.Schema({
    adminID: {type:mongoose.Schema.Types.ObjectId, ref:"adminTable"},
    packageID: {type:mongoose.Schema.Types.ObjectId, ref:"packagesTable"},
    ispID: {type:mongoose.Schema.Types.ObjectId, ref:"ispTable"},
    packageProfile: {type:mongoose.Schema.Types.String, ref:"packagesTable"},
    packageName: {type:mongoose.Schema.Types.String, ref:"packagesTable"},
    remarks: String
  })
const rejectedPackageTable = new mongoose.model("rejectedPackageTable", rejectedPackageSchema)

module.exports = rejectedPackageTable