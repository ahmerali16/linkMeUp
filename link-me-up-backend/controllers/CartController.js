const cartTable = require("../models/Cart");
const userTable = require("../models/Consumer");
const transporter = require("../middleware/Mail");
const ProviderRejectPackage = require("../models/RejectedPackageFromProvider");

const AddToCart = async (request, response) => {
  try {
      const { userID, packageID, ispID } = request.params;
      const { connectionAddress } = request.body;
      
      const packageCheck = await cartTable.findOne({ userID, 'packageDetails.packageID':packageID });
      if (packageCheck) {
          return response.send({ message: "Package has already been added to the cart" });
      }
      
      const ispCheck = await cartTable.findOne({ userID, ispID: { $ne: ispID } });
      if (ispCheck) {
          return response.send({ message: "A package from a different ISP is already in the cart. Please pay for or delete the existing package before adding a new one." });
      }

      const cart = await cartTable.findOne({ userID, ispID });
      if (cart) {
          cart.packageDetails.push({ packageID, connectionAddress });
          await cart.save();
          return response.send({ message: "Package has been added to the cart" });
      }
      
      const newPackage = new cartTable({
         userID,
         ispID,
         packageDetails: [{packageID,connectionAddress}] 
      });
      await newPackage.save();
      return response.send({ message: "Package has been added to the cart" });

  } catch (error) {
      console.log(error);
      return response.send({ message: "Internal Server Error" });
  }
};


const PackageApprovalFromProvider = async(request, response) => {
    try {
        const { cartID } = request.params;
        const packageCheck = await cartTable.findOne({'packageDetails._id':cartID})
        
    
        if (packageCheck) {
          const packageNumber = packageCheck.packageDetails.findIndex(pckg => pckg._id == cartID);
          if (packageNumber != -1)
            packageCheck.packageDetails[packageNumber].isApproval = true;
          await packageCheck.save();
          return response.send({message:'Request has been approved successfully'})
        } 
        else {
          return response.send({ message: "This package is not exist" });
        }
      } catch (error) {
        console.log(error);
        return response.send({ message: "Error in approving request" });
      }
};

const PackageRejectFromProvider = async(request, response) => {
  const {ispID, packageID, userID} = request.params;
  const {rejectedRemarks} = request.body;
  const user = await userTable.findById(userID)
  const {email, firstName} = user;
  try{
    const updateCart = await cartTable.updateOne(
      {userID, "packageDetails.packageID":packageID},
      {$pull: {packageDetails: {packageID:packageID}}}
    )

    if(updateCart){
      const rejectPackage = new ProviderRejectPackage({
        ispID,
        userID,
        packageID,
        remarks: rejectedRemarks
      })
      
      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "Package Reject from Provider",
        text: `Dear ${firstName} \n\nYour Package has been rejected from the provider and he gives the reason \n${rejectedRemarks}\n\nFor more information please check th cart`
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log("Error in sending payment receipt: ", error);
        else console.log("Payment receipt sent successfully");
      });

      await rejectPackage.save();
      return response.send({message: "Package Rejected and Deleted"})
    }
    return response.send({message:"Package Not Found"})
  }
  catch(error){
    console.log(error)
    response.send({message: "Internal Server Error"})
  }
}

const GetRejectedPackageDetails = async(request, response) => {
  const {ispID} = request.params;
  const packageDetails = await ProviderRejectPackage.find({ispID}).populate('userID packageID');
  try{
    response.send(packageDetails)
  }
  catch(error){
    response.send({message: "Internal Server Error"})
    console.log(error)
  }
}

const GetCartDetailsForConsumer = async(request, response) => {
  const {id} = request.params;
  const packageCheck = await cartTable.find({userID:id}).populate("packageDetails.packageID ispID")
  try{
    await response.send(packageCheck)
  }
  catch(error){
    console.log("Getting Error in sending details of cart for consumer"+error)
  }
};

const GetCartDetailsForProvider = async (request, response) => {
  try {
    const { ispID } = request.params;
    const cartDetails = await cartTable.find({ ispID }).populate("packageDetails.packageID ispID userID");

    const filteredCartDetails = cartDetails.map(cart => {
      cart.packageDetails = cart.packageDetails.filter(packageDetail => packageDetail.isApproval === false);
      return cart;
    }).filter(cart => cart.packageDetails.length > 0); 
    
    return response.send(filteredCartDetails);

  } catch (error) {
    console.log("Getting Error in sending details of cart for provider: " + error);
    return response.status(500).send({ message: "Error in getting cart details for provider" });
  }
};


const DeletePackageFromCart = async(request, response) => {
    try {
        const { cartID } = request.params;
        const packageCheck = await cartTable.updateOne(
          {"packageDetails._id":cartID},
          {$pull: {packageDetails: {_id:cartID}}}
        )

        if (packageCheck) {
          return response.send({message: "Package has been removed successfully",});
        } else {
          return response.send({ message: "Package not found" });
        }
      } catch (error) {
        console.log(error);
        response.send({ message: "Internal Server Error" });
      }
}

module.exports = {AddToCart, GetCartDetailsForConsumer, GetCartDetailsForProvider, PackageApprovalFromProvider,DeletePackageFromCart, PackageRejectFromProvider, GetRejectedPackageDetails}