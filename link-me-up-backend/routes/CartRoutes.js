const express = require('express')
const router = express.Router();

const {AddToCart, PackageApprovalFromProvider,DeletePackageFromCart, GetCartDetailsForConsumer, GetCartDetailsForProvider, PackageRejectFromProvider, GetRejectedPackageDetails} = require("../controllers/CartController");

router.post("/AddToCart/:userID/:packageID/:ispID", AddToCart);
router.get("/GetCartDetailsForConsumer/:id", GetCartDetailsForConsumer);
router.get("/GetCartDetailsForProvider/:ispID", GetCartDetailsForProvider)
router.put("/PackageApprovalFromProvider/:cartID", PackageApprovalFromProvider);
router.delete("/DeletePackageFromCart/:cartID", DeletePackageFromCart);
router.post("/PackageRejectFromProvider/:ispID/:packageID/:userID", PackageRejectFromProvider);
router.get("/GetRejectedPackageDetails/:ispID", GetRejectedPackageDetails)

module.exports = router