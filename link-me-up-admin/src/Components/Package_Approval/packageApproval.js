import React, { useEffect, useState } from "react";
import "./packageApproval.css"
import axios from "axios";



const PackageApproval = ({user}) => {

    const [packages, setPackages] = useState([])

    const [isRejected, setIsRejected] = useState(false)

    const [remarks, setRemarks] = useState("")

    const [allPackages, setAllPackages] = useState([]);


    const handleChange = eventTriggered => {
        setRemarks(eventTriggered.target.value)
    }

    useEffect(() => {
        axios.get("http://localhost:9002/Admin/GetPackagesDetailsForApproval")
        .then(response => {setPackages(response.data)})
        .catch(error => {alert(error.data.message)})
      },[])

      useEffect(() => {
        axios.get("http://localhost:9002/Admin/GetAllPackagesDetails")
        .then(response => setAllPackages(response.data))
        .catch(error => alert(error.data.message))
      },[])

      const Approve = packageID => {
        axios.put(`http://localhost:9002/Admin/ApprovePackage/${packageID}`)
        .then(response => alert(response.data.message))
        .catch(error => alert(error.data.message))
      }

      const Reject = (packageID) => {
        setIsRejected((prevStatus) => (prevStatus === packageID ? null : packageID));
      }

      const Submit = (packageID, adminID) => {
        if(remarks){
          axios.post(`http://localhost:9002/Admin/RejectPackage/${packageID}/${adminID}`,{remarks})
          .then(response => alert(response.data.message))
          .catch(error => alert(error.data.message))
          console.log(remarks)
        }
        else return alert("Please Enter Remarks")
      }

    return(
        <React.Fragment>
            {console.log(allPackages)}
            <div className="main-box">
                <div className="stats">
                    <div>
                        <h3>{allPackages.approved?.length}</h3>
                        <p>Approved Packages</p>
                    </div>
                    <hr/>
                    <div>
                        <h3>{allPackages.rejected?.length}</h3>
                        <p>Rejected Packages</p>
                    </div>
                    <hr/>
                    <div>
                        <h3>{packages?.length}</h3>
                        <p>Pending</p>
                    </div>
                </div>

                <div className="approval-box">
                    <h2>Packages Approval</h2>
                    <div className="package-display-box">
                        {(packages.length===0)? (<p>There are no packages for approval</p>):
                        (
                        <React.Fragment>
                          {console.log(packages)}
                            {packages?.map(packageRender => (
                            <div key={packageRender._id} className="actual-package-box">
                                {(isRejected===packageRender._id)? 
                                (<React.Fragment>
                                    <div className="reject-fields">
                                        <textarea name="remarks" value={remarks} placeholder="Remarks" onChange={handleChange}/>
                                        <button onClick={() => Submit(packageRender._id, user._id)}>Submit</button>
                                    </div>
                                </React.Fragment>):
                                (<React.Fragment>
                                    <img src={packageRender.packageProfile? `http://localhost:9002/ProviderPackages/${packageRender.packageProfile}`:"./No Image.jpg"} alt="Package Profile"/>
                                <div className="packageDetails">
                                    <img src={packageRender.ispID.ispProfile? `http://localhost:9002/Provider/${packageRender.ispID.ispProfile}`:"./No Image.jpg"} alt="ISP Profile"/>
                                    <div>
                                        <h3 style={{fontSize:'1rem'}}>{packageRender.packageName}</h3>
                                        <h4 style={{fontSize:'.8rem', fontWeight:'400'}}>{packageRender?.ispID?.ispName}</h4>
                                    </div>
                                </div>
                                <div className="packageDescription">
                                    <h4>Duration: <span>{packageRender.duration}</span></h4>
                                    <h4>Price: <span>{packageRender.price}</span></h4>
                                    <h4>Desciption:</h4>
                                    <p>{packageRender.description}</p>
                                </div>
                                <div className="package-actionButtons">
                                    <button onClick={() => Approve(packageRender._id)}>Approve</button>
                                    <button onClick={() => Reject(packageRender._id)}>Reject</button>
                                </div>
                                </React.Fragment>)}
                            </div>
                        ))}
                        </React.Fragment>)}
                    </div>
                </div>

                <div className="approval-history">
          <h2>Packages History</h2>
          <div className="history-display-box">
            {allPackages.rejected?.map(rejected => (
                <div key={rejected._id} className="actual-history-box">
              <div className="isp-name-profile">
                <img src={rejected.packageProfile? `http://localhost:9002/ProviderPackages/${rejected.packageProfile}`:'./No Image.jpg'} alt="Package Profile"/>
                <h2>{rejected.packageName}</h2>
              </div>

              <div className="ispName">
                <p>{rejected?.ispID?.ispName}</p>
              </div>

              <div className="remarks">
                <p>
                  Rejected:
                  <span>
                   {rejected.remarks}
                  </span>
                </p>
              </div>
            </div>
            ))}
          {allPackages.approved?.map(approved => (
                <div key={approved._id} className="actual-history-box">
              <div className="isp-name-profile">
                <img src={approved.packageProfile? `http://localhost:9002/ProviderPackages/${approved.packageProfile}`:"./NoImage.jpg"} alt="Package Profile"/>
                <h2>{approved.packageName}</h2>
              </div>

              <div className="ispName">
                <p>{approved.ispID.ispName}</p>
              </div>

              <div className="remarks">
                <p>
                  Approved
                </p>
              </div>
            </div>
            ))}
          </div>
        </div>
            </div>
        </React.Fragment>
    )
}

export default PackageApproval