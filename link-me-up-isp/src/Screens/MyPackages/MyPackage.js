import React, { useEffect, useState } from "react";
import "./MyPackage.css";
import axios from "axios";

const MyPackage = ({ user }) => {
  const ispID = user._id;

  const [updateInfo, setInfo] = useState({
    packageName: "",
    duration: "",
    price: "",
    description: "",
  });
  const [image, setImage] = useState();

  const [seeDetails, setSeeDetails] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [packageDetails, setPackageDetails] = useState();
  const [rejectedPackageDetails, setRejectedPackageDetails] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:9002/Package/GetPackageDetails/${ispID}`)
      .then((response) => {
        setPackageDetails(response.data);
      })
      .catch((error) => {
        alert(error.data.message);
      });

    axios
      .get(`http://localhost:9002/Package/GetRejectedPackageDetails/${ispID}`)
      .then((response) => setRejectedPackageDetails(response.data))
      .catch((error) => {
        console.error(
          "Getting Error in getting rejected package details",
          error
        );
      });
  }, [ispID]);

  const handleChange = (eventTriggered) => {
    const { name, value } = eventTriggered.target;
    setInfo({
      ...updateInfo,
      [name]: value,
    });
  };

  const Update = (packageID) => {
    const PackageData = new FormData();
    Object.entries(updateInfo).forEach(([key, value]) => {
      PackageData.append(key, value);
    });
    PackageData.append("PackageProfile", image);
    axios
      .put(
        `http://localhost:9002/Package/UpdatePackage/${packageID}`,
        PackageData
      )
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) =>
        console.error("Getting Error in Updating Package: " + error)
      );
  };

  const DeletePackage = (packageID) => {
    axios
      .delete(`http://localhost:9002/Package/DeletePackage/${packageID}`)
      .then((response) => alert(response.data.message))
      .catch((error) =>
        console.error("Getting Error in Deleting Package", error)
      );
  };

  return (
    <React.Fragment>
      <div className="main-box" style={{ width: "82vw", float: "right" }}>
        <div className="stats">
          <div>
            <h3>{packageDetails?.length}</h3>
            <p>Approved Packages</p>
          </div>
          <hr />
          <div>
            <h3>{rejectedPackageDetails?.length}</h3>
            <p>Rejected Packages</p>
          </div>
        </div>

        <div
          className="sections-box"
          style={{ width: "90%", maxHeight: "432px" }}
        >
          <h2>Rejected Packages</h2>
          <div
            className="packages-box"
            style={{ padding: "0 24px", overflowY: "auto", gap: "1.5rem" }}
          >
            {rejectedPackageDetails?.map((rejectedPackage) => (
              <div className="rejected-package-box">
                <img
                  src={
                    rejectedPackage.packageProfile
                      ? `http://localhost:9002/ProviderPackages/${rejectedPackage.packageProfile}`
                      : "./logon.png"
                  }
                  alt="Rejected Package Profile"
                />
                <h3>{rejectedPackage.packageName}</h3>
                <p>{rejectedPackage.remarks}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sections-box" style={{ width: "90%" }}>
          <h2>Approved Packages</h2>
          <div className="packages-box">
            {packageDetails?.map((packages) => (
              <div className="actual-package-box" key={packages._id}>
                {isEdit === packages._id ? (
                  <React.Fragment>
                    <div
                      className="reply-details"
                      style={{ marginTop: "1rem" }}
                    >
                      <input
                        name="packageName"
                        value={updateInfo.packageName}
                        type="text"
                        placeholder={packages.packageName}
                        onChange={handleChange}
                      />
                      <input
                        name="duration"
                        value={updateInfo.duration}
                        type="text"
                        placeholder={packages.duration}
                        onChange={handleChange}
                      />
                      <input
                        name="price"
                        value={updateInfo.price}
                        type="number"
                        placeholder={packages.price}
                        onChange={handleChange}
                      />
                      <textarea
                        name="description"
                        value={updateInfo.description}
                        placeholder={packages.description}
                        onChange={handleChange}
                      />
                      <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      <button onClick={() => Update(packages._id)}>
                        Update
                      </button>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <img
                      src={
                        packages.packageProfile
                          ? `http://localhost:9002/ProviderPackages/${packages.packageProfile}`
                          : "./NoImage.jpg"
                      }
                      alt="Package Profile"
                    />

                    <div className="basic-info">
                      <img
                        src={
                          packages.ispID.ispProfile
                            ? `http://localhost:9002/Provider/${packages.ispID.ispProfile}`
                            : "./logon.png"
                        }
                        alt="ISP Profile"
                      />
                      <div>
                        <h3>{packages.packageName}</h3>
                        <h5>{packages.ispID.ispName}</h5>
                      </div>
                    </div>

                    <img
                      src="./dropdown.svg"
                      alt="Drop Down Icon"
                      style={{ width: "30px", height: "30px" }}
                      className="dropDown"
                      onClick={() => setSeeDetails(packages._id)}
                    />

                    {seeDetails === packages._id ? (
                      <React.Fragment>
                        <div className="further-info">
                          <h4>
                            Duration: <span>{packages.duration}</span>
                          </h4>
                          <h4>
                            Price: <span>{packages.price}</span>
                          </h4>
                          <h4>Description</h4>
                          <p>{packages.description}</p>
                        </div>

                        <div className="btn">
                          <button onClick={() => setIsEdit(packages._id)}>
                            Edit
                          </button>
                          <button onClick={() => DeletePackage(packages._id)}>
                            Delete
                          </button>
                        </div>
                      </React.Fragment>
                    ) : null}
                  </React.Fragment>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MyPackage;
