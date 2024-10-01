const packagesTable = require('../models/Packages');
const rejectedPackageTable = require('../models/RejectedPackages');

const UploadPackage = async(request, response) => {
    try {
        const { ispID, packageName, duration, price, description } = request.body;
        const packageProfile = request.file?.filename;
        const packageCheck = await packagesTable.findOne({ ispID, packageName });
        const durationInMonths = (duration/30)+" Months"

        if (!packageCheck) {
          const newPackage = new packagesTable({
            ispID,
            packageName,
            duration:durationInMonths,
            price,
            description,
            packageProfile,
          });
          await newPackage.save();
          response.send({ message: "Package uploaded successfully"+"\nPlease wait for admin approval now" });
        } else {
          response.send({ message: "Package already exists for this ISP" });
        }
      } catch (error) {
        console.log(error);
        response.send({ message: "Error in uploading package" });
      }
};

const GetPackageDetails = async(request, response) => {
    const ispID = request.params.id;
    await packagesTable
        .find({ ispID, isAdminVerified:true })
        .populate("ispID", "ispName ispProfile") 
        .then((packages) => response.send(packages))
        .catch((error) => response.send({ message: "Error in getting packages details", error }));
};

const GetRejectedPackageDetails = async(request, response) => {
  const ispID = request.params.id;
  await rejectedPackageTable
      .find({ ispID })
      .then((packages) => response.send(packages))
      .catch((error) => response.send({ message: "Error in getting packages details", error }));
};

const UpdatePackage = async(request, response) => {
    try {
        const {packageID} = request.params;
        const { packageName, duration, price, description } = request.body;
        const updatedPackageProfile = request.file?.filename;
        const updatedPackageDetails = await packagesTable.findById(packageID);
        if (updatedPackageDetails) {
          if (packageName) updatedPackageDetails.packageName = packageName;
          if (duration) updatedPackageDetails.duration = duration;
          if (price) updatedPackageDetails.price = price;
          if (description) updatedPackageDetails.description = description;
          if (updatedPackageProfile)
            updatedPackageDetails.packageProfile = updatedPackageProfile;
          await updatedPackageDetails.save();
          response.send({
            message: "Package Details has been updated successfully",
          });
        } else return response.send({message: "Package not Found"});
      } catch (error) {
        console.log(error);
        response.send({ message: "Error in updating packages details" });
      }
};

const DeletePackage = async(request, response) => {
    try {
        const packageID = request.params.id;
        const deletePackage = await packagesTable.findByIdAndDelete(packageID);
        if (deletePackage) return response.send({ message: "Package Deleted Successfully" });
        return response.send({ message: "Package not found/already deleted" });
      } 
      catch (error) {
        console.log(error);
        reponse.send({message: "Inernal Server Error"})
      }
};

module.exports = {UploadPackage, GetPackageDetails, UpdatePackage, DeletePackage, GetRejectedPackageDetails}