import React, { useState } from "react";
import "./signIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = ({setLoginUser}) => {
    const navigate = useNavigate();

    const[user, setUser] = useState({
        email: "",
        password: ""
    });

    const [isForget, setIsForget] = useState(false)

    const handleChange = eventTriggered =>{
        const {name, value} = eventTriggered.target
        setUser({
            ...user,
            [name]: value
        });
    }

    const Login=()=>{
        const {email, password} = user;
        if(email&&password){
            axios.post("http://localhost:9002/Admin/SignIn", user)
            .then(response => {
                alert(response.data.message);
                setLoginUser(response.data.user)
                navigate("/ProviderApproval")
            })
        } 
        else alert("Please fill the fields");
    };

    const ForgetPassword = () => {
        const {email} = user
        if(email){
            axios.post("http://localhost:9002/Admin/ForgetPassword", {email})
            .then(response => {
                alert(response.data.message)
                navigate("/")
            })
            .catch(error => console.error("Getting Error in forget password: "+error))
        }
        else return alert("Enter your registered email")
    }

    return(
        <React.Fragment>
            <div className="main-box" style={{width:'100vw', float:'none', alignItems:'center', padding:'16px 0', display:'flex', flexDirection:'column'}}>
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
                        <h1>sign in</h1>
                        <div className="fileds">
                            <input name="email" value={user.email} type="email" placeholder="Email" onChange={handleChange}></input>
                            <input name="password" value={user.password} type="password" placeholder="Password" onChange={handleChange}></input>
                            <label onClick={() => setIsForget(true)}>forgot your password</label>
                        </div>
                        <button onClick={Login}>Sign In</button>
                        <p>Don't have an account 
                            <Link style={{textDecoration:'none'}} to="/SignUp"><span>Sign Up</span></Link>
                        </p>
                    </React.Fragment>)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default SignIn