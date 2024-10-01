import React, { useState } from "react";
import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = ({setLoginUser}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [isForget, setIsForget] = useState(false)

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setUser({
            ...user,
            [name] : value
        })
    }

    const SignIn = () => {
        const {email, password} = user;
        if(email && password){
            axios.post("http://localhost:9002/Consumer/SignIn", user)
            .then(response => {
                alert(response.data.message)
                setLoginUser(response.data.user)
                navigate("/")
            })
            .catch(error => console.error("Getting Error in Signing In: "+error))
        }
        else alert("Please Enter your Credentials")
    }

    const ForgetPassword = () => {
        const {email} = user
        if(email){
            axios.post("http://localhost:9002/Consumer/ForgetPassword", {email})
            .then(response => {
                alert(response.data.message)
                navigate("/SignIn")
            })
            .catch(error => console.error("Getting Error in Forgetting Passowrd: "+error))
        }
        else alert("Enter you registered email with us to forgot your password")
    }


    return(
        <React.Fragment>
            <div className="main-boxx">
                <div className="sign-box">
                    {isForget? 
                    (<React.Fragment>
                        <h1>Forget Password</h1>
                        <div className="fileds">
                            <input name="email" value={user.email} type="email" placeholder="Email" onChange={handleChange}/>
                        </div>
                        <button onClick={ForgetPassword}>Forget Password</button>
                    </React.Fragment>)
                    :
                    (<React.Fragment>
                        <h1>Sign In</h1>
                        <div className="fileds">
                            <input name="email" value={user.email} type="email" placeholder="Email" onChange={handleChange}/>
                            <input name="password" value={user.password} type="password" placeholder="Password" onChange={handleChange}/>
                            <label onClick={() => setIsForget(true)}>Forgot your Password</label>
                        </div>
                        <button onClick={SignIn}>Sign In</button>
                        <p>Don't have an account?
                            <Link style={{textDecoration:'none'}} to="/SignUp"><span style={{color:'#2F70B0'}}>Sign Up</span></Link>
                        </p>
                    </React.Fragment>)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default SignIn 