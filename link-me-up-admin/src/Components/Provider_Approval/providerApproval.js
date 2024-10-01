import React, { useEffect, useState } from "react";
import "./providerApproval.css";
import axios from "axios";

const ProviderApproval = ({user}) => {

  const [isp, setIsp] = useState([])

  const [allISPs, setAllISPs] = useState([])

  const [isRejected, setIsRejected] = useState(false)

  const [remarks, setRemarks] = useState("")


  const handleChange = eventTriggered => {
    setRemarks(eventTriggered.target.value)
  }

  useEffect(() => {
    axios.get("http://localhost:9002/Admin/GetProviderDetailsForApproval")
    .then(response => {setIsp(response.data)})
    .catch(error => {alert(error.data.message)})

  },[])

  useEffect(() => {
    axios.get("http://localhost:9002/Admin/GetAllProvidersDetails")
    .then(response => setAllISPs(response.data))
    .catch(error => alert(error.data.message))
  },[])

  const Approve = ispID => {
    axios.put(`http://localhost:9002/Admin/ApproveProvider/${ispID}`)
    .then(response => {alert(response.data.message)})
    .catch(error => {alert(error.data.message)})
  }

  const Reject = (ispID) => {
    setIsRejected((prevStatus) => (prevStatus === ispID ? null : ispID));
  }

  const Submit = (ispID, adminID) => {
    if(remarks){
      axios.post(`http://localhost:9002/Admin/RejectProvider/${ispID}/${adminID}`,{remarks})
      .then(response => alert(response.data.message))
      .catch(error => alert(error.data.message))
      console.log(remarks)
    }
    else return alert("Please Enter Remarks")
  }

  return (
    <React.Fragment>
       {console.log(allISPs)}
      <div className="main-box">
        <div className="stats">
          <div>
            <h3>{allISPs.ISPs?.length}</h3>
            <p>Approved Provider</p>
          </div>
          <hr />
          <div>
            <h3>{allISPs.rejectedISPs?.length}</h3>
            <p>Rejected Providers</p>
          </div>
          <hr />
          <div>
            <h3>{isp?.length}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="approval-box">
          <h2>Providers Approval</h2>
          <div className="package-display-box">
            {(isp.length===0)? (<p>There are no approvals pending</p>):(
              <React.Fragment>
                {isp?.map(ispRender => ( 
                <div key={ispRender._id} className="actual-package-box">
                {(isRejected===ispRender._id)? (
                <div className="reject-fields">
                  <textarea name="remarks" value={remarks} placeholder="Remarks" onChange={handleChange}/>
                  <button onClick={() => Submit(ispRender._id, user._id)}>Submit</button>
                </div>
                ):(
                  <React.Fragment>
                  <img src={ispRender.ispProfile? `http://localhost:9002/Provider/${ispRender.ispProfile}`:'./Link Me Up Logo.png'} alt="Providers Profile" />
                  <h3 style={{ padding: "0 10px" }}>{ispRender.ispName}</h3>
                  <p style={{ padding: "0 10px" }}>
                    {ispRender.firstName} Has request for the approval of their ISP from the {ispRender.cityName}
                  </p>
                  <div className="package-actionButtons">
                    <button onClick={() => Approve(ispRender._id)}>Approve</button>
                    <button onClick={() => Reject(ispRender._id)}>Reject</button>
                  </div>
                  </React.Fragment>
                )}
              </div>
            ))}
              </React.Fragment>
            )}
            
          </div>
        </div>

        <div className="approval-history">
          <h2>Providers History</h2>
          <div className="history-display-box">
            {allISPs.rejectedISPs?.map(rISP => (
                <div className="actual-history-box">
              <div className="isp-name-profile">
                <img src={rISP.ispProfile? `http://localhost:9002/Provider/${rISP.ispProfile}`:'./No Image.jpg'} alt="ISP Profile"/>
                <h2>{rISP.ispName}</h2>
              </div>

              <div className="remarks">
                <p>
                  Rejected:
                  <span>
                   {rISP.remarks}
                  </span>
                </p>
              </div>
            </div>
            ))}
          {allISPs.ISPs?.map(ISP => (
                <div className="actual-history-box">
              <div className="isp-name-profile">
                <img src={ISP.ispProfile? `http://localhost:9002/Provider/${ISP.ispProfile}`:"./NoImage.jpg"} alt="ISP Profile"/>
                <h2>{ISP.ispName}</h2>
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
  );
};

export default ProviderApproval;
