import React, { useRef, useState } from "react";
import './SignUp.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {

    const navigate = useNavigate();
    const [isCreate, setIsCreate] = useState(false)
    const[user, setUser] = useState({
        firstName:"",
        lastName:"",
        email:"",
        phoneNo:"",
        password:"",
        ispName:"",
        cityName:"",
        address:"",
        c: "",
        o: "",
        d: "",
        e: ""
    });
    const [error, setError] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: '' 
    });
    const[image, setImage] = useState();
    const {c,o,d,e,email} = user;
    const finalOTP = c+o+d+e;

    const cRef = useRef(null);
    const oRef = useRef(null);
    const dRef = useRef(null);
    const eRef = useRef(null);

    const isPasswordValid = password => {
        const minLength = 6;
        const atLeastOneCapitalLetter = 1;
        const atLeastOneSmallLetter = 1;
        const atLeastOneNumber = 1;
        const atLeastOneSpecialCharacter = 1;

        const atLeastOneCapitalLetterRegex = /[A-Z]/;
        const atLeastOneSmallLetterRegex = /[a-z]/;
        const atLeastOneNumberRegex = /\d/;
        const atLeastOneSpecialCharacterRegex = /[@$!%*?&#]/;

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

    const validateInput = (name, value) => {
        switch(name){
            case 'firstName':
                setError({
                    ...error,
                    [name]: isFirstLastNameValid(value)? "" : `First name should contain at least 3 characters`
                });
                break;
            case 'lastName':
                setError({
                    ...error,
                    [name]: isFirstLastNameValid(value)? "" : `Last name should contain at least 3 characters`
                });
                break;
            case 'email':
                setError({
                    ...error,
                    [name]: isEmailValid(value)? "" : "Email address should contain at least 3 characters with @"
                });
                break;
            case 'phoneNo':
                setError({
                    ...error,
                    [name] : isPhoneNoValid(value)? "" : "Phone number must contain 11 digits"
                });
                break;
                case 'password':
                setError({
                    ...error,
                    [name]: isPasswordValid(value) ? "" : (
                    <>
                        Password should:<br />
                            - Be at least 6 characters<br />
                            - Contain at least 1 Capital Letter<br />
                            - Contain at least 1 Small Letter<br />
                            - Contain at least 1 Number<br />
                            - Contain at least 1 Special Character
                   </>)
                });
                break;
            default: 
                break;
        }
    }


    const handleOtpChange = (eventTriggered, nextRef) => {
        const { name, value } = eventTriggered.target;
        setUser({
            ...user,
            [name]: value,
        });

        if (value.length === 1 && nextRef.current) {
            nextRef.current.focus();
        }
    };

    const handleChange = eventTriggered =>{
        const {name, value} = eventTriggered.target
        setUser({
            ...user,
            [name]: value
        });
        validateInput(name, value);
    }

    const CreateAccount = () => {
        const ISPRegisterdData = new FormData();
        Object.entries(user).forEach(([key, value]) => {ISPRegisterdData.append(key, value)});
        ISPRegisterdData.append("ProviderProfile", image);
        const {firstName, lastName, email, phoneNo, password, ispName, cityName, address} = user
        if(isFirstLastNameValid(firstName) && isFirstLastNameValid(lastName) && isEmailValid(email) && isPhoneNoValid(phoneNo) && isPasswordValid(password) && ispName && cityName && address){
            axios.post("http://localhost:9002/Provider/SignUp", ISPRegisterdData)
            .then(response => {
                alert(response.data.message)
                setIsCreate(true)
            })
            .catch(error => console.error("Getting Error in Sign Up: "+error))
        }
    };

    const Verify = () => {
        axios.post("http://localhost:9002/Provider/VerifyOTP", {finalOTP, email})
        .then(resonse => {
            alert(resonse.data.message)
            setIsCreate(false)
            navigate(`/AccountDetails/${email}`)
        })
        .catch(error => console.error("Getting Error in verifying OTP: "+error))
    }


    return(
        <React.Fragment>
            <div className="main-box">
                <div className="sign-box">
                    <h1>Sign Up</h1>
                    <div className="fileds">
                        <input name="firstName" value={user.firstName} type="text" placeholder="First Name" onChange={handleChange}/>
                        <p className="error-message" style={{fontSize:'14px', marginTop:'-8px'}}>{error.firstName}</p>
                        <input name="lastName" value={user.lastName} type="text" placeholder="Last Name" onChange={handleChange}/>
                        <p className="error-message" style={{fontSize:'14px', marginTop:'-8px'}}>{error.lastName}</p>
                        <input name="email" value={user.email} type="email" placeholder="Email" onChange={handleChange}/>
                        <p className="error-message" style={{fontSize:'14px', marginTop:'-8px'}}>{error.email}</p>
                        <input name="phoneNo" value={user.phoneNo} type="tel" placeholder="Mobile No" onChange={handleChange}/>
                        <p className="error-message" style={{fontSize:'14px', marginTop:'-8px'}}>{error.phoneNo}</p>
                        <input name="password" value={user.password} type="password" placeholder="Password" onChange={handleChange}/>
                        <p className="error-message" style={{fontSize:'14px', marginTop:'-8px'}}>{error.password}</p>
                        <input name="ispName" value={user.ispName} type="text" placeholder="ISP Name" onChange={handleChange}/>
                        <input name="cityName" value={user.cityName} type="text" placeholder="City Name" onChange={handleChange}/>
                        <input name="address" value={user.address}  type="text" placeholder="Address" onChange={handleChange}/>
                        <input type="file" onChange={e => setImage(e.target.files[0])}/>
                    </div>
                    {isCreate? 
                    (<React.Fragment>
                        <div className="otpBox">
                            <input name='c' value={user.c} type='text' onChange={e => handleOtpChange(e, oRef)} ref={cRef} maxLength={1}/>
                            <input name='o' value={user.o} type='text' onChange={e => handleOtpChange(e, dRef)} ref={oRef}  maxLength={1}/>
                            <input name='d' value={user.d} type='text' onChange={e => handleOtpChange(e, eRef)} ref={dRef}  maxLength={1}/>
                            <input name='e' value={user.e} type='text' onChange={handleChange} ref={eRef}  maxLength={1}/>
                        </div>
                        <button onClick={Verify}>Verify</button>
                    </React.Fragment>)
                    :
                    (<React.Fragment>
                        <button onClick={CreateAccount}>Create Accont</button>
                        <p>Already have an account? 
                            <Link style={{textDecoration:'none'}} to="/"><span style={{color:'#2F70B0'}}>Sign In</span></Link>
                        </p>
                    </React.Fragment>)}
                    
                </div>
            </div>
        </React.Fragment>
    )
}

export default SignUp