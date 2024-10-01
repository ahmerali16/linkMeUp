const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref:'userTable'},
    ispID: {type: mongoose.Schema.Types.ObjectId, ref:'ispTable'},
    packageDetails: [{
        packageID: {type: mongoose.Schema.Types.ObjectId, ref: "packagesTable"},
        dateOfPurchase: {type: Date, default: Date.now()},
        validTill: {type: Date, default: Date.now()}
    }],
    payment_receipt: String,
    isProviderAcknowledged: {type: Boolean, default:false}
})

const Transaction = new mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;