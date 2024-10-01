import React, { useEffect, useState } from "react";
import "./cities.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Islamabad = ({ user }) => {
  const naviagte = useNavigate();

  const [seeDetails, setSeeDetails] = useState(false);

  const [isSubscribe, setIsSubscribe] = useState(false);

  const [selectedISP, setSelectedISP] = useState(null)

  const [packagesDetails, setPackagesDetails] = useState([]);

  const [connectionAddress, setAddress] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:9002/Consumer/GetISPANDPACKAGES/islamabad")
      .then((response) => setPackagesDetails(response.data))
      .catch((error) =>
        console.error("Getting Error in retrieving packages details: " + error)
      );
  }, []);

  const filteredPackages = selectedISP? packagesDetails.PackageDetails.filter(pkg => pkg.ispID._id === selectedISP):packagesDetails.PackageDetails

  const Subscribe = packageID => {
    if (user && user._id) {
      setIsSubscribe(packageID);
    } else {
      alert("Please Login First");
      naviagte("/SignIn");
    }
  };

  const AddToCart = (userID, packageID, ispID) =>{
    if(connectionAddress){
      axios.post(`http://localhost:9002/Cart/AddToCart/${userID}/${packageID}/${ispID}`, {connectionAddress})
      .then(response => {
        alert(response.data.message)
        naviagte(`/Cart/${userID}`)
      })
      .catch(error => console.error("Getting Error in adding package to the cart"+error))
    }
    else alert("Please Enter the Address")
  };

  return (
    <React.Fragment>
      {console.log(packagesDetails)}
      <div
        className="main-boxx"
        style={{ alignItems: "flex-start", rowGap: "1rem" }}
      >
        <div className="city-line">
          <h1 style={{fontSize:'5rem'}}>Islamabad Best isp's</h1>
        </div>

        <div className="isps-filter-component">
          <button onClick={() => setSelectedISP(null)}>All</button>
          {packagesDetails.ProviderDetails?.map((isp) => (
            <button key={isp._id} onClick={() => setSelectedISP(isp._id)}>{isp.ispName}</button>
          ))}
        </div>

        <div className="package-display-box">
          {filteredPackages?.map((packages) => (
            <div className="actual-package-box" key={packages._id}>
              {(isSubscribe===packages._id) ? (
                <React.Fragment>
                  <textarea placeholder="Address" name="address" value={connectionAddress} onChange={e => setAddress(e.target.value)}/>
                  <button style={{width:'80%', alignSelf:'center'}} onClick={() => AddToCart(user._id, packages._id, packages.ispID._id)}>Add to Cart</button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <img
                    src={
                      packages.packageProfile
                        ? `http://localhost:9002/ProviderPackages/${packages.packageProfile}`
                        : "./logon.png"
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
                      <h5>{packages.ispID?.ispName}</h5>
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
                        <button onClick={() => Subscribe(packages._id)}>Subscribe</button>
                      </div>
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
              )}
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Islamabad;
