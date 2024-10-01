const express = require("express")
const router = express.Router();

const {SignUp, VerifyOTP, SignIn, GetProviderDetailsForApproval, ApproveProvider, RejectProvider, GetAllProvidersDetails, GetPackagesDetailsForApproval, ApprovePackage, RejectPackage, GetAllPackagesDetails, ForgetPassword} = require("../controllers/AdminController")
const {UploadAdminProfile} = require("../middleware/Multer");

router.post("/SignUp", UploadAdminProfile.single("AdminProfile"), SignUp)
router.post("/VerifyOTP", VerifyOTP)
router.post("/SignIn", SignIn)
router.get("/GetProviderDetailsForApproval", GetProviderDetailsForApproval)
router.put("/ApproveProvider/:ispID", ApproveProvider)
router.post("/RejectProvider/:ispID/:adminID", RejectProvider)
router.get("/GetAllProvidersDetails", GetAllProvidersDetails)
router.get("/GetPackagesDetailsForApproval", GetPackagesDetailsForApproval)
router.put("/ApprovePackage/:packageID", ApprovePackage)
router.post("/RejectPackage/:packageID/:adminID", RejectPackage)
router.get("/GetAllPackagesDetails", GetAllPackagesDetails)
router.post("/ForgetPassword", ForgetPassword)

module.exports = router