const GenerateOTP = require('../middleware/OTP')
const transporter = require('../middleware/Mail')
const ispTable = require('../models/Provider');
const SystemRequest = require('../models/SystemRequest');
const Transaction  = require('../models/Transaction');
const userTable = require('../models/Consumer');
const packagesTable = require('../models/Packages');

const SignUp = async(request, response) => {
    try {
        const {
          firstName,
          lastName,
          email,
          phoneNo,
          password,
          ispName,
          cityName,
          address,
        } = request.body;
        const ispProfile = request.file?.filename;
        const OTP = GenerateOTP();
        console.log(`OTP for ${email}:${OTP}`);
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
        const lowerCaseCityName = cityName.toLowerCase();
        const newISPUser = new ispTable({
          firstName,
          lastName,
          email,
          phoneNo,
          password,
          ispName,
          cityName: lowerCaseCityName,
          address,
          ispProfile,
          OTP,
          otpExpiry,
        });
        const userCheck = await ispTable.findOne({ email });
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
          await newISPUser.save();
          response.send({ message: "Please enter OTP to get registered" });
          if (ispTable.isVerified) {
            setTimeout(async () => {
              await ispTable.findOneAndDelete({ email });
              console.log("User deleted due to OTP expiration");
            }, otpExpiry - Date.now());
          }
        } else
          return response.send({ message: "User has already been Registered" });
      } catch (error) {
        console.log(error);
        response.send({ message: "Error Signing Up" });
      }
};

const VerifyOTP = async(request, response) => {
    try {
        const { finalOTP, email } = request.body;
        const userCheck = await ispTable.findOne({ email });
        if (userCheck) {
          if (userCheck.OTP === finalOTP) {
            (userCheck.OTP = null),
              (userCheck.otpExpiry = null),
              (userCheck.isVerified = true);
            await userCheck.save();
            response.send({ message: "Please enter account details now" });
          } else {
            await ispTable.findOneAndDelete({ email });
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

const AccountDetails = async(request, response) => {
  const { email } = request.params;
  const  {accounts}  = request.body;
  const provider_check = await ispTable.findOne({email})
  try{
    if(provider_check){
      provider_check.accountDetails = accounts;
      await provider_check.save();
      return response.send({message: "Your all details has been saved"+"\nWait for Admin approval now"})
    }
    return response.send({message: "User Not Found"})
  }
  catch(error){
    response.send({message: "Internal Server Error"})
    console.log(error)
  }
}

const SignIn = async(request, response) => {
    try {
        const { email, password } = request.body;
        const user = await ispTable.findOne({ email });
        if (!user) return response.send({ message: "Please Get Registered First" });
        if (user.password === password && user.isAdminVerified)
          return response.send({ message: "Login Successful", user: user });
        if (user.password !== password)
          return response.send({ message: "Invalid Password" });
        if(user.isAdminVerified===false)
          return response.send({message: "Approval Pending"})
      } catch (error) {
        response.send({ message: "Error Logging In" });
      }
};

const UpdateInfo = async(request, response) => {
    try {
        const {ispID} = request.params;
        const {
          firstName,
          lastName,
          email,
          phoneNo,
          currentPass,
          newPass,
          ispName,
          cityName,
          address,
        } = request.body;
        const ispProfileUpdated = request.file?.filename;
        const lowerCaseCityName = cityName.toLowerCase();
        const basicInfo = await ispTable.findById(ispID);
        if (basicInfo) {
          const isPasswordValid = (await basicInfo.password) === currentPass;
          if (firstName) basicInfo.firstName = firstName;
          if (lastName) basicInfo.lastName = lastName;
          if (email) basicInfo.email = email;
          if (phoneNo) basicInfo.phoneNo = phoneNo;
          if (ispName) basicInfo.ispName = ispName;
          if (cityName) basicInfo.cityName = lowerCaseCityName;
          if (address) basicInfo.address = address;
          if (ispProfileUpdated) basicInfo.ispProfile = ispProfileUpdated;
          if (currentPass) {
            if (!isPasswordValid)
              return response.send({
                message: "Incorrect current password. Please try again.",
              });
            if (newPass) basicInfo.password = newPass;
          }
          await basicInfo.save();
          response.send({
            message: "Basic Info has been Updated Successfully",
            user: basicInfo,
          });
        } else return response.send({ message: "Invalid User" });
      } catch (error) {
        console.error(error);
        return response.send({
          message: "Error in Updating ISP User Basic Info",
        });
      }
};

const ForgetPassword = async(request, response) => {
  const {email} = request.body
  const userCheck = await ispTable.findOne({email})

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
};

const SystemPosts = async(request, response) => {
  const {ispID} = request.params;
  const reply_check = await SystemRequest.findOne({'ispDetails.ispID':ispID});
  const systemDetails = await SystemRequest.find().populate('userID')
  try{
    if(!reply_check)
      return response.send(systemDetails)
  }
  catch(error){
    response.send({message: "Ineternal Server Error"})
    console.log(error)
  }
}

const SystemReply = async(request, response) => {
  const {detailsID, ispID} = request.params;
  const {price, remarks} = request.body;
  const details_check = await SystemRequest.findById({_id: detailsID})
  try{
    if(details_check){
      details_check.ispDetails.push({
        ispID: ispID,
        price: price,
        remarks: remarks
      })
      await details_check.save();
      return response.send({message: "System request reply submitted"})
    }
    return response.send({message: "You have already replied this system request"})
  }
  catch(error){
    response.send({message: 'Internal Server Error'})
    console.log(error)
  }
};

const GetReceiptForProvider = async(request, response) => {
  const {ispID} = request.params;
  try{
    const receiptCheck = await Transaction.find({ispID, isProviderAcknowledged:false}).populate('packageDetails.packageID userID')
    const approved = await Transaction.find({ispID, isProviderAcknowledged:true}).populate('packageDetails.packageID userID')
    return response.send({receiptCheck, approved})
  }
  catch(error){
    console.log(error)
    return response.send({message: "Internal Server Error"})
  }
};

const PaymentAcknowledgement = async(request, response) => {
  const {transactionID} = request.params;
  const receipt_check = await Transaction.findById(transactionID)
  const {userID, packageDetails} = receipt_check;
  const user_check = await userTable.findById(userID)
  const {email, firstName} = user_check;

  try{
    if(receipt_check){
     receipt_check.isProviderAcknowledged = true;

     for (const id of packageDetails) {
      const packageCheck = await packagesTable.findById(id.packageID);
      const dateOfPurchase = id.dateOfPurchase;
      const { duration } = packageCheck;
      const durationInDays = parseFloat(duration) * 30;

      const packageValidation = new Date(dateOfPurchase);
      packageValidation.setDate(packageValidation.getDate() + durationInDays);
      
      id.validTill = packageValidation;
    }

      await receipt_check.save();

      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: `LinkMeUp: Payment Acknowledgement`,
        text: `Dear ${firstName},\n\nYour paymemt receipt has been acknowledged from the provider. For more information check the portal.`
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log("Error in sending acknowledgement: ", error);
        else console.log("Acknowledgement sent successfully");
      });
      return response.send({message: "Payment Acknowledged"})
    }
    return response.send({message: "Transaction ID Invalid"})
  }
  catch(error){
    console.log(error)
    return response.send({message: "Internal Server Error"})
  }
}

module.exports = {SignUp, VerifyOTP, SignIn, UpdateInfo, ForgetPassword, SystemPosts, SystemReply, AccountDetails,GetReceiptForProvider, PaymentAcknowledgement}