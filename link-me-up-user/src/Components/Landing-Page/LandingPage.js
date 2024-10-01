import React, { useState } from "react";
import './LandingPage.css';
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {

  const [isContact, setIsContact] = useState(false);

  const [contactUs, setContactUs] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = eventTriggered => {
    const {name, value} = eventTriggered.target;
    setContactUs({
      ...contactUs,
      [name]:value
    })
  };

  const SendMessage = () => {
    const {name, email, message} = contactUs;
    if(name&&email&&message){
      axios.post("http://localhost:9002/Consumer/ContactUs",contactUs)
      .then(response => alert(response.data.message))
      .catch(error => console.error("Getting Erorr in Sending Message: "+error))
    }
    else alert("Please Fill the fields first");
  }

  return(
    <React.Fragment>
      <div className="main-boxx" style={{padding:0}}>
        <div className="section1">
          <img src="./section1.svg" alt="Section 1 Banner"/>
          <h1>Your <span style={{color: '#2F70B0'}}>link</span> to the digital world</h1>
          <div className="section1-box">
            <div>
              <img src="./ads.svg" alt="Ads Logo"/>
              <h3>Advertising</h3>
              <p>Providers promote services with targeted banner Ads</p>
            </div>
            <hr/>
            <div>
              <img src="./hub.svg" alt="Unified Hub Logo"/>
              <h3>Ultimate Hub</h3>
              <p>Bringing together consumers and providers in one marketplace</p>
            </div>
            <hr/>
            <div>
              <img src="./billing.svg" alt="Billing Logo"/>
              <h3>Effortless Billing</h3>
              <p>Simplifying billing with digital receipts</p>
            </div>
          </div>
        </div>
        <div className="section2">
          <img src="https://www.connect.net.pk/assets/application/public/images/page/img-about.webp" alt="setion2"/>
          <div className="section2-box">
            <h1>About <span style={{color: '#2F70B0'}}>Link Me Up</span></h1>
            <p>Established in 2023, Link Me Up is the premier marketplace for Internet and Cable Service Providers. We offer a comprehensive platform for both corporate and consumer sectors to compare and choose the best packages available.</p>
            <p>Link Me Up is more than just a marketplace; it’s a passion-driven initiative dedicated to growth, service, and excellence. Our success story is built on the hard work, dedication, and commitment of our team. For our users, Link Me Up stands for unparalleled commitment, exceptional customer care, integrity, deep product knowledge, seamless services, and competitive pricing.</p>
          </div>
        </div>
        <div className="section3">
          {isContact? 
          (<React.Fragment>
            <div className="contact-form">
              <h3>Contact Us</h3>
              <input name="name" value={contactUs.name} type="text" placeholder="Name" onChange={handleChange}/>
              <input name="email" value={contactUs.email} type="email" placeholder="Email" onChange={handleChange}/>
              <textarea name="message" value={contactUs.message} placeholder="Message" onChange={handleChange}/>
              <button onClick={SendMessage}>Send</button>
            </div>
          </React.Fragment>)
          :
          (<React.Fragment>
              <div className="section3-box">
                <h2>The Best Solution for Internet Service Needs</h2>
                <p>At Link Me Up, we provide the ultimate solution for internet and cable service needs. Our platform connects users with the best internet service providers, ensuring coverage across urban areas, remote regions, and rural villages.For more queries contact with us</p>
                <button onClick={() => setIsContact(true)}>Contact Us</button>
            </div>
          </React.Fragment>)}
        </div>
        <div className="section4">
          <h2>find us in these cities</h2>
          <div className="cityContainer">
            <div className="city-box">
              <img src="./Karachi Box.png" alt="Karachi"/>
              <Link style={{textDecoration:'none'}} to="/Karachi"><label className="overlay">Karachi</label></Link>
            </div>

            <div className="city-box">
              <img src="./Hyd Box.png" alt="Hyderabad"/>
              <Link style={{textDecoration:'none'}} to="/Hyderabad"><label className="overlay">Hyderabad</label></Link>
            </div>

            <div className="city-box">
              <img src="./Lahore Box.png" alt="Lahore"/>
              <Link style={{textDecoration:'none'}} to="/Lahore"><label className="overlay">Lahore</label></Link>
            </div>

            <div className="city-box">
              <img src="./Islamabad Box.png" alt="Islamabad"/>
              <Link style={{textDecoration:'none'}} to="/Islamabad"><label className="overlay">Islamabad</label></Link>
            </div>

          </div>
        </div>
        <div className="footer">
          <div className="footer-box">
            <img src="./footerMap.png" alt="Map" style={{height:'80%'}}/>
            <h1>Link Me Up</h1>
          </div>
          <div className="copyRight">
            <img src="./Copyright SVG.svg" alt="copyright"/>
            <p>2024 Link Me Up. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LandingPage