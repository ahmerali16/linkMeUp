import React, { useState } from "react";
import "./Profile.css";
import axios from "axios";

const Profile = ({user, setLoginUser}) => {

    const [updateInfo, setInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        currentPass: "",
        newPass: ""
    })

    const [image, setImage] = useState();

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setInfo({
            ...updateInfo,
            [name] : value
        })
    }

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

    const Update = userID => {
        const ConsumerData = new FormData();
        Object.entries(updateInfo).forEach(([key, value]) => {ConsumerData.append(key, value)});
        ConsumerData.append("ConsumerProfile", image);
        console.log(updateInfo)
        const {firstName, lastName, email, phoneNo, newPass} = updateInfo;
        if(isFirstLastNameValid(firstName) || isFirstLastNameValid(lastName) || isEmailValid(email) || isPhoneNoValid(phoneNo) || isPasswordValid(newPass)){
            axios.put(`http://localhost:9002/Consumer/UpdateInfo/${userID}`, ConsumerData)
            .then(response => {
                alert(response.data.message)
                setLoginUser(response.data.user)
            })
            .catch(error => console.error("Getting error in updating consumer basic info"+error))
        }
        else alert("Please complete the validation")
    }

    return(
        <React.Fragment>
            <div className="main-boxx" style={{rowGap:'4rem'}}>
                <div className="sections-box" style={{marginTop:'6rem'}}>
                        <h2>My Profile</h2>
                        <label style={{top:'9.5rem'}}>First Name</label>
                        <input name="firstName" value={updateInfo.firstName} type="text" placeholder={user?.firstName} onChange={handleChange}/>
                        <label style={{top:'16.3rem'}}>Last Name</label>
                        <input name="lastName" value={updateInfo.lastName} type="text" placeholder={user?.lastName} onChange={handleChange}/>
                        <label style={{top:'23.1rem'}}>Email</label>
                        <input name="email" value={updateInfo.email} type="email" placeholder={user?.email} onChange={handleChange}/>
                        <label style={{top:'29.9rem'}}>Phone No</label>
                        <input name="phoneNo" value={updateInfo.phoneNo} type="tel" placeholder={user?.phoneNo} onChange={handleChange}/>
                        <label style={{top:'36.5rem'}}>User Profile</label>
                        <input type="file" onChange={e => setImage(e.target.files[0])}/>
                        <button onClick={() => Update(user._id)}>Save</button>
                </div>

                <div className="sections-box">
                        <h2>Password</h2>
                        <input name="currentPass" value={updateInfo.currentPass} type="password" placeholder="Current Password" onChange={handleChange}/>
                        <input name="newPass" value={updateInfo.newPass} type="password" placeholder="New Password" onChange={handleChange}/>
                        <button>Save</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Profile;