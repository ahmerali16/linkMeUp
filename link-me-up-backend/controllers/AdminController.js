const adminTable = require('../models/Admin')
const ispTable = require("../models/Provider")
const GenerateOTP = require("../middleware/OTP")
const transporter = require("../middleware/Mail")
const rejectedISPTable = require("../models/RejectedProviders")
const packagesTable = require("../models/Packages")
const rejectedPackageTable = require("../models/RejectedPackages")

const SignUp = async(request, response) => {
    try {
        const { firstName, lastName, email, phoneNo, password, secretKey } = request.body;
        const SECRET_KEY = "LINKMEUP2223"
        const adminProfile = request.file?.filename;
        const OTP = GenerateOTP();
        console.log(`OTP for ${email}:${OTP}`);
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
        if (secretKey === SECRET_KEY) {
          const newAdminUser = new adminTable({
            firstName,
            lastName,
            email,
            phoneNo,
            password,
            adminProfile,
            OTP,
            otpExpiry,
            secretKey,
          });
          const userCheck = await adminTable.findOne({ email });
          if (!userCheck) {
            const otpExpiryInMinutes = Math.ceil(
              (otpExpiry - Date.now()) / (1000 * 60)
            );
            const mailOptions = {
              from: process.env.SMTP_MAIL,
              to: email,
              subject:
                "Secure Your Link Me Up Account - Your One-Time Password (OTP) Details Inside",
              text:
                "Dear" +
                firstName +
                ",\n" +
                "We hope this message finds you well. To ensure the security of your Link Me Up account, we have implemented an additional layer of protection through One-Time Password (OTP) authentication." +
                "\n" +
                "Your OTP Details:" +
                "\nOTP: " +
                OTP +
                "\nValidity: " +
                otpExpiryInMinutes +
                " minutes\n" +
                "Please use the provided OTP to verify and access your Link Me Up account securely. If you did not request this OTP or suspect any unauthorized activity, please contact our support team immediately." +
                "\nThank you for choosing Link Me Up" +
                "\nBest regards," +
                "Link Me Up Team",
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) console.log("Error in sending OTP: ", error);
              else console.log("OTP sent successfully");
            });
            await newAdminUser.save();
            response.send({ message: "Please enter OTP to get registered" });
            if (adminTable.isVeified) {
              setTimeout(async () => {
                await adminTable.findOneAndDelete({ email });
                console.log("User deleted due to OTP expiration");
              }, otpExpiry - Date.now());
            }
          } else
            return response.send({ message: "User has already been Registered" });
        } else response.send({ message: "Invalid Secret Key" });
      } catch (error) {
        console.log(error);
        response.send({ message: "Error Signing Up" });
      }
};

const VerifyOTP = async(request, response) => {
    try {
        const { finalOTP, email } = request.body;
        const userCheck = await adminTable.findOne({ email });
        if (userCheck) {
          if (userCheck.OTP === finalOTP) {
            (userCheck.OTP = null),
              (userCheck.otpExpiry = null),
              (userCheck.isVerified = true);
            await userCheck.save();
            response.send({ message: "User has been registered sucessfully" });
          } else {
            await adminTable.findOneAndDelete({ email });
            response.send({
              message:
                "You Entered Wrong OTP. Now Please try to register yourself again",
            });
          }
        } else response.send({ message: "User Not Found" });
      } catch (error) {
        console.log(error);
        response.send({ message: "Error verifying OTP" });
      }
};

const SignIn = async(request, response) => {
    try {
        const { email, password } = request.body;
        const user = await adminTable.findOne({ email });
        if (!user) return response.send({ message: "Invalid Credentials" });
        if (user.password === password)
          return response.send({ message: "Login Successful", user: user });
        if (user.password !== password)
          return response.send({ message: "Invalid Password" });
      } catch (error) {
        response.send({ message: "Error Logging In" });
      }
};

const GetProviderDetailsForApproval = async(request, response) => {
    try {        
        const ispUsers = await ispTable.find({isAdminVerified: false})
        response.send(ispUsers)
      } 
      catch (error) {
        console.log(error);
        response.status(500).send({ message: "Error retrieving ISP users" });
      }
};

const ApproveProvider = async(request, response) => {
    try{
        const {ispID} = request.params;
        const ispCheck = await ispTable.findOne({_id:ispID})
    
        if(ispCheck){
          const {email, firstName, ispName} = ispCheck;
          ispCheck.isAdminVerified = true
          const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject:
              "Activation Confirmation: Access Granted to Link ME UP Platform",
            text:
              "Dear" + " "+
               firstName +
              ",\n" +
              "I trust this email finds you well. We are delighted to notify you that your"+ " "+
               ispName+ " "
               +"has been successfully approved to access and utilize the Link ME UP platform. "
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log("Error in sending approval mail: ", error);
            else console.log("Approval Mail sent successfully");
          });
          await ispCheck.save();
          return response.send({message: 'ISP Approved'})
        }
        else return response.send({message: "ISP Not Found"})
      }
      catch(error) {
        return response.send({message: 'Internal Server Error'})
      }
};

const RejectProvider = async(request, response) => {
    try {
        const { ispID, adminID } = request.params;
        const { remarks } = request.body;
        console.log(remarks)
    
        const ispCheck = await ispTable.findOne({ _id: ispID });
    
        if (ispCheck) {
          const { ispName, email, firstName, ispProfile } = ispCheck;
          const rejectedContent = new rejectedISPTable({
            adminID,
            ispID,
            ispName,
            ispProfile,
            remarks,
          });
          await rejectedContent.save();
    
          const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "Rejected: Access Rejected to Link ME UP Platform",
            text: `Dear ${firstName},\n\nI trust this email finds you well. We are delighted to notify you that your ${ispName} has been rejected due to ${remarks}.`,
          };
    
          try {
            await transporter.sendMail(mailOptions);
            console.log("Approval Mail sent successfully");
          } catch (error) {
            console.log("Error in sending approval mail: ", error);
          }
    
          // Delete the ISP after rejection and email sending
          await ispTable.deleteOne({ _id: ispID });
    
          return response.send({ message: "ISP Rejected and Deleted" });
        } else {
          return response.send({ message: "ISP Not Found" });
        }
      } catch (error) {
        console.error("Internal Server Error:", error);
        return response.status(500).send({ message: "Internal Server Error" });
      }
};

const GetAllProvidersDetails = async(request, response) => {
    try{
        const isAdminVerified = request.query.isAdminVerified || true;
        const query = { isAdminVerified };
        const rejectedISPs = await rejectedISPTable.find()
        const ISPs = await ispTable.find(query)
    
        const allISPs = {
          rejectedISPs: rejectedISPs,
          ISPs: ISPs
        }
    
        return response.send(allISPs)
      }
      catch(error){
        return response.send({message:"Internal Server Error"})
      }
};

const GetPackagesDetailsForApproval = async(request, response) => {
    try {
        const isAdminVerified = request.query.isAdminVerified || false;
        const query = { isAdminVerified };
        
        const packages = await packagesTable.find(query)
        .populate({path:'ispID', select: 'ispName ispProfile'});
        
        response.send(packages);
      } catch (error) {
        console.log(error);
        response.send({ message: "Error retrieving Packages" });
      }
};

const ApprovePackage = async(request, response) => {
    try{
        const {packageID} = request.params;
        const packageCheck = await packagesTable.findOne({_id:packageID})
    
        if(packageCheck){
          packageCheck.isAdminVerified = true
          await packageCheck.save();
          return response.send({message: 'Package Approved'})
        }
        else return response.send({message: "Package Not Found"})
      }
      catch(error) {
        return response.send({message: 'Internal Server Error'})
      }
};

const RejectPackage = async(request,response) => {
    try {
        const { packageID, adminID } = request.params;
        const { remarks } = request.body;
    
        const packageCheck = await packagesTable.findOne({ _id: packageID });
    
        if (packageCheck) {
          const { ispID, packageProfile, packageName} = packageCheck;
          const rejectedContent = new rejectedPackageTable({
            adminID,
            packageID,
            ispID,
            packageProfile,
            remarks,
            packageName
          });
          await rejectedContent.save();
    
          await packagesTable.deleteOne({ _id: packageID });
    
          return response.send({ message: "Package Rejected and Deleted" });
        } else {
          return response.send({ message: "Package Not Found" });
        }
      } catch (error) {
        return response.status(500).send({ message: "Internal Server Error" });
      }
};

const GetAllPackagesDetails = async(request, response) => {
    try{
        const isAdminVerified = request.query.isAdminVerified || true;
        const query = { isAdminVerified };
        const rejectedPackages = await rejectedPackageTable.find().populate({path:'ispID', select:"ispName"});
        const packages = await packagesTable.find(query).populate({path:'ispID', select:'ispName'})
    
        const allPackages = {
          rejected: rejectedPackages,
          approved: packages
        }
    
        return response.send(allPackages)
      }
      catch(error){
        return response.send({message:"Internal Server Error"})
      }
};

const ForgetPassword = async(request, response) => {
  const {email} = request.body
  const userCheck = await adminTable.findOne({email})

  if(userCheck){
    const {password} = userCheck
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "Forgot Password of Link Me Up Account",
      text: "Your Password is: "+password
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log("Error in sending Password: ", error);
      else console.log("Password sent successfully");
    });
    await response.send({message: 'Password has been sent on you registered email'})
  }
  else{
    return response.send({message: "Email didn't exit"})
  }
}

module.exports = {SignUp,VerifyOTP, SignIn, GetProviderDetailsForApproval, ApproveProvider, RejectProvider, GetAllProvidersDetails,GetPackagesDetailsForApproval, ApprovePackage, RejectPackage, GetAllPackagesDetails, ForgetPassword}