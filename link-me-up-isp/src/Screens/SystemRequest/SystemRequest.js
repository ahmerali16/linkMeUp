import React, { useEffect, useState } from "react";
import "./SystemRequest.css"
import axios from "axios";

const SystemRequest = ({user}) => {

  const [seeDetails, setSeeDetails] = useState(false);
  const [isReply, setIsReply] = useState(false)
  const [systemDetails, setSystemDetails] = useState([]);
  const [replyDetails, setReplyDetails] = useState({
    price: 0,
    remarks: ""
  })

  useEffect(() => {
    axios.get(`http://localhost:9002/Provider/SystemPosts/${user._id}`)
    .then(response => setSystemDetails(response.data))
    .catch(error => console.error("Getting error in retrieving System Requests"+error))
  },[user._id])

  const handleReplyChange = eventTriggered => {
    const {name, value} = eventTriggered.target;
    setReplyDetails({
        ...replyDetails,
        [name]:value
    })
  };

  const Reply = (detailsID, ispID) => {
    const {price} = replyDetails
    if(price){
        axios.put(`http://localhost:9002/Provider/SystemReply/${detailsID}/${ispID}`,replyDetails)
        .then(response => alert(response.data.message))
        .catch(error => console.error("Getting error in replying to a system request: "+error))
    }
    else alert("Please enter the price")
  }

  return (
    <React.Fragment>
      <div className="main-box" style={{ width: "82vw", float: "right" }}>
        <div className="sections-box" style={{ width: "90%" }}>
          <h2>Pending Requests</h2>
          <div className="packages-box">
            {systemDetails?.map(details => (
                <div className="actual-package-box" style={{ padding: "1rem 0" }} key={details._id}>
                <img
                  src={details.userID.ConsumerProfile? `http://localhost:9002/Consumer/${details.userID.ConsumerProfile}`:"./NoImage.jpg"}
                  alt="Package Profile"
                  onClick={() => setSeeDetails(details._id)}
                  style={{
                    width: "50%",
                    height: "150px",
                    objectFit: "contain",
                    borderRadius: "50%",
                    alignSelf: "center",
                  }}
                />
  
                <div className="basic-info">
                  <h3>{details.userID.firstName} has requested for the system</h3>
                </div>
  
                {(isReply===details._id)? 
                (<React.Fragment>
                  <div className="reply-details">
                      <input name="price" value={replyDetails.price} type="number" placeholder="Enter Estimated Cost" onChange={handleReplyChange}/>
                      <textarea name="remarks" value={replyDetails.remarks} placeholder="Is there any remarks?" onChange={handleReplyChange}/>
                      <button onClick={() => Reply(details._id, user._id)}>Submit</button>
                  </div>
                </React.Fragment>)
                :
                (<React.Fragment>
                   {(seeDetails===details._id)? (
                  <React.Fragment>
                    <div className="further-info">
                      <h4>
                        Mobile No: <span>{details.userID.phoneNo}</span>
                      </h4>
                      <h4>
                        Number of Systems: <span>{details.number_of_systems}</span>
                      </h4>
                      <h4>Address: <span>{details.address}</span></h4>
                      <h4>Requirement of Systems</h4>
                      {details.specifications?.map((spec,index) => (
                        <p>System {index+1}: <span>{spec}</span></p>
                      ))}
                    </div>
  
                    <button style={{margin:'0.2rem 1rem'}} onClick={() => setIsReply(details._id)}>Reply</button>
                  </React.Fragment>
                ) : null}
                </React.Fragment>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SystemRequest;
