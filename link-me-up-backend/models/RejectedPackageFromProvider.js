const mongoose = require("mongoose");

const providerRejectedPackage = new mongoose.Schema({
    ispID: {type: mongoose.Schema.Types.ObjectId, ref: 'ispTable'},
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'userTable'},
    packageID: {type: mongoose.Schema.Types.ObjectId, ref: 'packagesTable'},
    remarks: String
})

const ProviderRejectPackage = new mongoose.model('ProviderRejectPackage', providerRejectedPackage);

module.exports = ProviderRejectPackage