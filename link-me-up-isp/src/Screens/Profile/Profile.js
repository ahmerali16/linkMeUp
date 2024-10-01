import React, { useState } from "react";
import "./Profile.css"
import axios from "axios";

const Profile = ({user, setLoginUser}) => {

    const[updateInfo, setInfo] = useState({
        firstName:"",
        lastName:"",
        email:"",
        phoneNo:"",
        currentPass:"",
        newPass: "",
        ispName:"",
        cityName:"",
        address:"",
    });

    const[image, setImage] = useState();

    const isPasswordValid = password => {
        const minLength = 6;
        const atLeastOneCapitalLetter = 1;
        const atLeastOneSmallLetter = 1;
        const atLeastOneNumber = 1;
        const atLeastOneSpecialCharacter = 1;

        const atLeastOneCapitalLetterRegex = /[A-Z]/;
        const atLeastOneSmallLetterRegex = /[a-z]/;
        const atLeastOneNumberRegex = /\d/;
        const atLeastOneSpecialCharacterRegex = /[@$!%*?&]/;

        return (
            password.length >= minLength &&
            (password.match(atLeastOneCapitalLetterRegex) || []).length >= atLeastOneCapitalLetter &&
            (password.match(atLeastOneSmallLetterRegex) || []).length >= atLeastOneSmallLetter &&
            (password.match(atLeastOneNumberRegex) || []).length >= atLeastOneNumber &&
            (password.match(atLeastOneSpecialCharacterRegex) || []).length >= atLeastOneSpecialCharacter
        );
    }

    const isFirstLastNameValid = name => {
        const minLength = 3;
        const atLeastNameValidRegex = /[a-zA-Z]{3,}/;

        return(
            name.length >= minLength &&
            atLeastNameValidRegex.test(name)
        );
    };

    const isEmailValid = email => {
        const minLength = 3;
        const atLeastThreeCharactersRegex = /[a-zA-Z]{3,}/;
        const containsAtSymbolRegex = /@/;
    
        return (
            email.length >= minLength &&
            atLeastThreeCharactersRegex.test(email) &&
            containsAtSymbolRegex.test(email)
        );
    }

    const isPhoneNoValid = phoneNo => {
        const length = 11;
        const phoneNoRegex = /^\d+$/;

        return (
            phoneNo.length === length &&
            phoneNoRegex.test(phoneNo)
        );
    }

    const handleChange = eventTriggered =>{
        const {name, value} = eventTriggered.target
        setInfo({
            ...updateInfo,
            [name]: value
        });
    }

    const Update = ispID => {
        const ISPRegisterdData = new FormData();
        Object.entries(updateInfo).forEach(([key, value]) => {ISPRegisterdData.append(key, value)});
        ISPRegisterdData.append("ProviderProfile", image);
        const {firstName, lastName, email, phoneNo, newPass, currentPass} = updateInfo
        if(isFirstLastNameValid(firstName) || isFirstLastNameValid(lastName) || isEmailValid(email) || isPhoneNoValid(phoneNo) || isPasswordValid(newPass)){
            axios.put(`http://localhost:9002/Provider/UpdateInfo/${ispID}`, ISPRegisterdData)
            .then(response => {
                alert(response.data.message)
                setLoginUser(response.data.user)
            })
            .catch(error => console.error("Getting Error in Sign Up: "+error))
        }
        else alert("Please complete the validations in order to update the information")
        console.log(currentPass+"\n"+newPass)
    }

    return(
        <React.Fragment>
            <div className="main-box" style={{width:'82vw', float:'right'}}>
               <div className="sections-box">
                    <h2>My Profile</h2>
                    <label style={{top:'96px'}}>First Name</label>
                    <input name="firstName" value={updateInfo.firstName} type="text" placeholder={user.firstName} onChange={handleChange}/>
                    <label style={{top:'204px'}}>Last Name</label>
                    <input name="lastName" value={updateInfo.lastName} type="text" placeholder={user.lastName} onChange={handleChange}/>
                    <label style={{top:'312px'}}>Email</label>
                    <input name="email" value={updateInfo.email} type="text" placeholder={user.email} onChange={handleChange}/>
                    <label style={{top:'420px'}}>Phone No</label>
                    <input name="phoneNo" value={updateInfo.phoneNo} type="text" placeholder={user.phoneNo} onChange={handleChange}/>
                    <button onClick={() => Update(user._id)}>Save</button>
               </div>

               <div className="sections-box">
                    <h2>Password</h2>
                    <input name="currentPass" value={updateInfo.currentPass} type="password" placeholder="Current Password" onChange={handleChange}/>
                    <input name="newPass" value={updateInfo.newPass} type="password" placeholder="New Password" onChange={handleChange}/>
                    <button onClick={() => Update(user._id)}>Save</button>
               </div>

               <div className="sections-box">
                    <h2>Provider Information</h2>
                    <label style={{top:'67.1rem'}}>ISP Name</label>
                    <input  name="ispName" value={updateInfo.ispName}type="text" placeholder={user.ispName} onChange={handleChange}/>
                    <label style={{top:'73.8rem'}}>Address</label>
                    <input name="address" value={updateInfo.address} type="text" placeholder={user.address} onChange={handleChange}/>
                    <label style={{top:'80.5rem'}}>City Name</label>
                    <input name="cityName" value={updateInfo.cityName} type="text" placeholder={user.cityName} onChange={handleChange}/>
                    <label style={{top:'87.2rem'}}>ISP Profile</label>
                    <input type="file" onChange={e => setImage(e.target.files[0])}/>
                    <button onClick={() => Update(user._id)}>Save</button>
               </div>
            </div>
        </React.Fragment>
    )
}

export default Profile