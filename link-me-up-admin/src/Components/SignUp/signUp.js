import React, { useRef, useState } from "react";
import "./signUp.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        password: '',
        c: '',
        o: '',
        d: '',
        e: '',
        secretKey: ''
    });

    const [adminProfile, setAdminProfile] = useState();

    const {c,o,d,e,email} = user;

    const finalOTP = c+o+d+e;

    const cRef = useRef(null)
    const oRef = useRef(null);
    const dRef = useRef(null);
    const eRef = useRef(null);

    const [isRegister, setIsRegister] = useState(false);

    const [error, setError] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: '' 
    })

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

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setUser({
            ...user,
            [name]:value
        })
        validateInput(name, value);
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

    const Register = () =>{
        const adminRegisterdData = new FormData();
        Object.entries(user).forEach(([key, value]) => {adminRegisterdData.append(key, value)});
        adminRegisterdData.append("AdminProfile",adminProfile)
        const {firstName,lastName,email,phoneNo,password,secretKey} = user
        if(firstName&&lastName&&email&&phoneNo&&password&&secretKey){
            axios.post("http://localhost:9002/Admin/SignUp", adminRegisterdData)
            .then(response => {
                alert(response.data.message)
                setIsRegister(true);
            })
        }
        else alert("Please fill all fields");
    }

    const Verify = () => {
        axios.post("http://localhost:9002/Admin/VerifyOTP", {finalOTP, email})
        .then(response => {
            alert(response.data.message)
            navigate("/")
            setIsRegister(false);
        })
    }

    return(
        <React.Fragment>
            <div className="main-box" style={{width:'100vw', float:'none', alignItems:'center', padding:'16px 0'}}>
                <div className="sign-box">
                    <h1>sign up</h1>
                    <div className="fileds">
                        <input name="firstName" value={user.firstName} type="text" placeholder="First Name" onChange={handleChange}/>
                        {error.firstName && <p className="error-message">{error.firstName}</p>}
                        <input name="lastName" value={user.lastName} type="text" placeholder="Last Name" onChange={handleChange}/>
                        {error.lastName && <p className="error-message">{error.lastName}</p>}
                        <input name="email" value={user.email} type="email" placeholder="Email" onChange={handleChange}/>
                        {error.email && <p className="error-message">{error.email}</p>}
                        <input name="phoneNo" value={user.phoneNo} type="tel" placeholder="Phone No" onChange={handleChange}/>
                        {error.phoneNo && <p className="error-message">{error.phoneNo}</p>}
                        <input name="password" value={user.password} type="password" placeholder="Password" onChange={handleChange}/>
                        {error.password && <p className="error-message">{error.password}</p>}
                        <input name="secretKey" value={user.secretKey} type="password" placeholder="SECRET KEY" onChange={handleChange}/>
                        <input type="file" onChange={e => setAdminProfile(e.target.files[0])}/>
                    </div>
                    {isRegister?
                     (
                        <React.Fragment>
                            <div className='otpBox'>
                                <input name='c' value={user.c} type='text' onChange={e => handleOtpChange(e, oRef)} ref={cRef} maxLength={1}/>
                                <input name='o' value={user.o} type='text' onChange={e => handleOtpChange(e, dRef)} ref={oRef}  maxLength={1}/>
                                <input name='d' value={user.d} type='text' onChange={e => handleOtpChange(e, eRef)} ref={dRef}  maxLength={1}/>
                                <input name='e' value={user.e} type='text' onChange={handleChange} ref={eRef}  maxLength={1}/>
                            </div>
                            <button onClick={Verify}>Verify</button>
                        </React.Fragment>
                     ):
                     <button onClick={Register}>Register</button>
                     }
                     <p style={{marginTop:'-25px'}}>Already have an account 
                        <Link style={{textDecoration:'none'}} to="/"><span>Sign In</span></Link>
                     </p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SignUp