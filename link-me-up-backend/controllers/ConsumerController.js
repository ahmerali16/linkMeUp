const userTable = require("../models/Consumer");
const GenerateOTP = require("../middleware/OTP");
const transporter = require("../middleware/Mail");
const ispTable = require("../models/Provider");
const packagesTable = require("../models/Packages");
const SystemRequest = require("../models/SystemRequest");
const Transaction = require("../models/Transaction");
const cartTable = require("../models/Cart");

const SignUp = async(request, response) => {
    try {
        const { firstName, lastName, email, password, phoneNo } = request.body;
        const ConsumerProfile = request.file?.filename;
        const OTP = GenerateOTP();
        console.log(`OTP for ${email}:${OTP}`);
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
        const newUser = new userTable({
          firstName,
          lastName,
          email,
          password,
          phoneNo,
          ConsumerProfile,
          OTP,
          otpExpiry,
        });
        const userCheck = await userTable.findOne({ email });
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
              "\nLink Me Up Team",
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log("Error in sending OTP: ", error);
            else console.log("OTP sent successfully");
          });
          await newUser.save();
          response.send({ message: "Please enter OTP to get registered" });
          if (userTable.isVerified) {
            setTimeout(async () => {
              await userTable.findOneAndDelete({ email });
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
        const userCheck = await userTable.findOne({ email });
        if (userCheck) {
          if (userCheck.OTP === finalOTP) {
            (userCheck.OTP = null),
              (userCheck.otpExpiry = null),
              (userCheck.isVerified = true);
            await userCheck.save();
            response.send({ message: "User has been registered sucessfully" });
          } else {
            await userTable.findOneAndDelete({ email });
            response.send({ message: "You Entered Wrong OTP" });
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
        const user = await userTable.findOne({ email });
        if (!user) return response.send({ message: "Invalid Credentials" });
        if (user.password === password)
          return response.send({ message: "Login Successful", user: user });
        if (user.password !== password)
          return response.send({ message: "Invalid Password" });
      } catch (error) {
        response.send({ message: "Error Logging In" });
      }
};

const UpdateInfo = async (request, response) => {
  const { userID } = request.params;
  const { firstName, lastName, email, phoneNo, currentPass, newPass } = request.body;
  const ConsumerProfile = request.file?.filename;

  try {
    const user_check = await userTable.findById(userID);

    if (!user_check) {
      return response.send({ message: "User not found" });
    }

    const isPasswordValid = user_check.password === currentPass;

    if (firstName) user_check.firstName = firstName;
    if (lastName) user_check.lastName = lastName;
    if (email) user_check.email = email;
    if (phoneNo) user_check.phoneNo = phoneNo;
    if (ConsumerProfile) user_check.ConsumerProfile = ConsumerProfile;
    if (currentPass) {
      if (!isPasswordValid) {
        return response.send({ message: "Incorrect Current Password. Please try again" });
      }
      if (newPass) user_check.password = newPass;
    }

    await user_check.save();

    return response.send({ message: "Your Information has been updated", user: user_check });
  } catch (error) {
    console.error(error);
    return response.send({ message: "Internal Server Error" });
  }
};


const GetISPANDPACKAGES = async(request, response) => {
  const {cityName} = request.params;
  const ProviderDetails = await ispTable.find({cityName, isAdminVerified:true});
  const ProviderIDs = ProviderDetails.map(provider => provider._id)
  const PackageDetails = await packagesTable.find({ispID: ProviderIDs, isAdminVerified:true}).populate({path:'ispID', select:'ispName ispProfile'})
  try{
    if(PackageDetails) return response.send({ProviderDetails, PackageDetails})
    else return response.send({message: "There are no packages listed here"})
  }
  catch(error){
    response.send({message: "Internal Server Error"})
    console.log(error)
  }
};

const SystemPostRequest = async(request, response) => {
  const {userID} = request.params;
  const { specifications, numSystems, address } = request.body;
  const newSystemRequest = new SystemRequest({
    userID, 
    number_of_systems:numSystems, 
    address, 
    specifications,
    // ispDetails: [{ispID:userID}]
  })
  try{
      await newSystemRequest.save();
      return response.send({message: "Your request has been posted"});
  }
  catch(error){
    await response.send({message: "Internal Server Error"})
    console.log(error)
  }
};

const SystemReply = async(request, response) => {
  const {userID} = request.params;
  const reply_check = await SystemRequest.find({userID}).populate("ispDetails.ispID")
  try{
    await response.send(reply_check)
  }
  catch(error){
    console.log(error)
    return response.send({message: "Internal Server Error"})
  }
}

const ContactUs = async(request, response) => {
  const {name, email, message} = request.body;
  const mailOptions = {
    from: email,
    to: process.env.SMTP_MAIL,
    subject: "Message From "+name,
    text: message
  };
  try{
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log("Error in sending OTP: ", error);
      else console.log("OTP sent successfully");
    });
    await response.send({message: "Message has been sent"})
  }
  catch(error){
    response.send({message: "Internal Server Error"})
    console.log(error)
  }
};

const MakePayment = async(request, response) => {
  const {userID, ispID} = request.params;
  const {packageIDs} = request.body;
  const payment_receipt = request.file?.filename;
  const condition = await Transaction.findById(userID, ispID)
  const packageLength = (packageIDs.length===24)? true: false;
  const userCheck = await ispTable.findById(ispID)
  const {email, firstName} = userCheck;

  try{
    if(!condition){
      if(packageLength){
        const transaction = new Transaction({
          userID,
          ispID,
          packageDetails: [{packageID: packageIDs}],
          payment_receipt
        })
        await transaction.save();
      }
      else{
        const packageDetails = packageIDs?.map(packageID => ({
          packageID,
          dateOfPurchase: new Date(),
          validTill: new Date()
        }))
        const transaction = new Transaction({
          userID, 
          ispID, 
          packageDetails,
          payment_receipt
        })
        await transaction.save();
      }
      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "Check portal for payment receipt",
        text:  `Hello ${firstName} \nYou've recieved a payment for the package for more information please check portal and give acknowledgement`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log("Error in sending payment receipt: ", error);
        else console.log("Payment receipt sent successfully");
      });
      await cartTable.findOneAndDelete({userID, ispID});
      return response.send({message: "Payment receipt has sent"+"\nPlease wait for provider's acknowledgement now"})
    }
    return response.send({message: "Package has already subscribed"})
  }
  catch(error){
    console.log(error)
    response.send({message: "Internal Server Error"})
  }
};

const GetReceiptForConsumer = async(request, response) => {
  const {userID} = request.params;
  try{
    const receipt_check = await Transaction.find({userID, isProviderAcknowledged:true}).populate('packageDetails.packageID ispID')
    return response.send(receipt_check)
  }
  catch(error){
    console.log(error)
    return response.send({message: "Internal Server Error"})
  }
};

const ForgetPassword = async(request, response) => {
  const {email} = request.body
  const userCheck = await userTable.findOne({email})

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

module.exports = {SignUp, VerifyOTP, SignIn, GetISPANDPACKAGES, SystemPostRequest, ContactUs, UpdateInfo, MakePayment, GetReceiptForConsumer, SystemReply, ForgetPassword}