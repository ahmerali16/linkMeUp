const multer = require("multer");
const path = require("path");

const IspStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,"./uploads/Provider") },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.ispName+path.extname(file.originalname)) }
});
const uploadIspProfile = multer({storage:IspStorage})

const packageStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/ProviderPackages') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.ispID+"_"+request.body.packageName+path.extname(file.originalname)) }
});
const UploadPackageProfile = multer({storage:packageStorage})

const adminStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/Admin') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.firstName+"_Admin_"+path.extname(file.originalname)) }
});
const UploadAdminProfile = multer({storage:adminStorage})

const userStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/Consumer') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+request.body.firstName+path.extname(file.originalname)) }
});
const UploadUserProfile = multer({storage:userStorage})

const paymentStorage = multer.diskStorage({
    destination: (request, file, cb) => { cb(null,'./uploads/PaymentReceipts') },
    filename: (request, file, cb) => { cb(null,file.fieldname+"_"+path.extname(file.originalname)) }
});
const Payment = multer({storage:paymentStorage})

module.exports = {uploadIspProfile, UploadPackageProfile, UploadAdminProfile, UploadUserProfile, Payment}