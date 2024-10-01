const express = require("express");
const router = express.Router();

const {SignUp, VerifyOTP, SignIn, GetISPANDPACKAGES, SystemPostRequest, ContactUs, UpdateInfo, MakePayment, GetReceiptForConsumer, SystemReply, ForgetPassword} = require("../controllers/ConsumerController");
const {UploadUserProfile, Payment} = require("../middleware/Multer")


router.post("/SignUp", UploadUserProfile.single("ConsumerProfile"), SignUp)
router.post("/VerifyOTP", VerifyOTP)
router.post("/SignIn", SignIn)
router.get("/GetISPANDPACKAGES/:cityName", GetISPANDPACKAGES)
router.post("/SystemPostRequest/:userID", SystemPostRequest);
router.post("/ContactUs", ContactUs);
router.put("/UpdateInfo/:userID", UploadUserProfile.single("ConsumerProfile"), UpdateInfo)
router.post("/MakePayment/:userID/:ispID", Payment.single("PaymentReceipts"), MakePayment)
router.get("/GetReceiptForConsumer/:userID", GetReceiptForConsumer)
router.get("/SystemReply/:userID", SystemReply)
router.post("/ForgetPassword", ForgetPassword)

module.exports = router;