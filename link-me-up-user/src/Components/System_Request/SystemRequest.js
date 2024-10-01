import React, { useEffect, useState } from "react";
import "./SystemRequest.css";
import axios from "axios";

const SystemRequest = ({user}) => {
  const [numSystems, setNumSystems] = useState(0);
  const [specifications, setSpecifications] = useState([]);
  const [address, setAddress] = useState("")
  const [systemReply, setSystemReply] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:9002/Consumer/SystemReply/${user._id}`)
    .then(response => setSystemReply(response.data))
    .catch(error => console.error("Getting error in retrieving system reply"+error))
  }, [user._id])

  const handleNumSystemsChange = eventTriggered => {
    const value = parseInt(eventTriggered.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 1000) {
      setNumSystems(value);
      setSpecifications(Array(value).fill(""));
    } else {
      // Handle invalid input, such as displaying an error message
      console.error("Invalid input for number of systems");
    }
  };

  const handleSpecificationChange = (index, eventTriggered) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = eventTriggered.target.value;
    setSpecifications(newSpecifications);
  };

  const handleSubmit = () => {
    axios.post(`http://localhost:9002/Consumer/SystemPostRequest/${user._id}`,{specifications, numSystems, address})
    .then(response => alert(response.data.message))
    .catch(error => console.error("Getting Error in Posting System Request: "+error))
  };
  
  return (
    <React.Fragment>
      {console.log(systemReply)}
      <div className="main-boxx" style={{rowGap:'5rem'}}>
        <div className="section" style={{marginTop:'6rem', height:'28.5rem'}}>
          <h2>Post System Request</h2>
          <label>Enter Number of Systems you want to install</label>
          <input
              type="number"
              value={numSystems}
              onChange={handleNumSystemsChange}
            />
              <div>
                {specifications.map((spec, index) => (
                  <textarea
                    placeholder={`Specification for System ${index+1}`}
                    value={spec}
                    onChange={(e) => handleSpecificationChange(index, e)}
                  />
                ))}
              </div>
            <input value={address} type="text" placeholder="Enter Address you want to install the system" onChange={e => setAddress(e.target.value)}/>
            <button onClick={handleSubmit}>Post</button>
        </div>

        <div className="receipt-section-box" style={{marginTop:0, width:'70%'}}>
          <h1 style={{fontSize:"xx-large"}}>System Request Reply</h1>
              <div className="receipts-box">
                {systemReply?.map(reply => (
                  <div className="actual-receipt">
                  <h5 style={{fontFamily: "auto", fontSize: "large"}}>Number of Systems: {reply.number_of_systems}</h5>
                  {reply.specifications?.map((spec, index) => (
                    <div className="additional-info" style={{gap:'0.4rem'}}>
                      <p>System {index+1}: {spec}</p>
                  </div>
                  ))}

               <h4>Replies from Provider</h4>

               {reply.ispDetails?.map(isp => (
                 <div className="additional-info">
                  <div>
                    <label>{isp.ispID.ispName}</label>
                    <h5 style={{fontSize:'medium'}}>Estimated Cost: <span>{isp.price}</span></h5>
                    <p>Remarks: {isp.remarks}</p>
                  </div>
               </div>
               ))}
             </div>
                ))}
              </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SystemRequest;
