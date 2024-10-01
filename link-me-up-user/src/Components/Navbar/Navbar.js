import React, { useState } from "react";
import "./Navbar.css"
import { Link } from "react-router-dom";

const NavBar=({user, setLoginUser})=>{

    const [isMenu, setIsMenu] = useState(false)

    const SignOut = () => {
        setLoginUser("")
    }

    const closeMenu = () => {
        setIsMenu(!isMenu)
    }

    return(
        <React.Fragment>
        <div className="navBar">
            <div className='navBar-box'>
               <Link style={{textDecoration:'none'}} to="/">
                    <div className="logoText-box">
                        <img src="../Link Me Up Logo.png" alt="Website Logo"/>
                        <h2 style={{color:'black'}}>Link Me Up</h2>
                    </div>
                </Link>
              <div className="navBar-buttons">
                {(user&&user._id)? 
                (<React.Fragment>
                    <div>
                        <label>Hello, <span style={{fontWeight:'600', color:'#2F70B0'}}>{user?.firstName}</span></label>
                        <img src={user.ConsumerProfile? `http://localhost:9002/Consumer/${user.ConsumerProfile}`:'./user.svg'} alt="User Profile" onClick={() => setIsMenu(!isMenu)}/>
                    </div>
                    <Link style={{textDecoration:'none'}} to="/"><button onClick={SignOut}>Sign out</button></Link>
                    <Link to={`/Cart/${user._id}`}><img src="../cart.svg" alt="Cart Logo"/></Link>
                    {isMenu? 
                    (<React.Fragment>
                        <div className="user-menu">
                            <Link to="/Profile"><button onClick={closeMenu}>Profile</button></Link>
                            <Link to="/SystemRequest"><button onClick={closeMenu}>System Request</button></Link>
                            <Link to="/MyPackages"><button onClick={closeMenu}>My Packages</button></Link>
                        </div>
                    </React.Fragment>):(null)}
                </React.Fragment>)
                :
                (<React.Fragment>
                    <Link style={{textDecoration:'none'}} to="./SignIn"><button>Sign in</button></Link>
                    <Link style={{textDecoration:'none'}} to="./SignUp"><button>Sign up</button></Link>
                </React.Fragment>)}
              </div>
            </div>
        </div>
        </React.Fragment>
    );
}

export default NavBar