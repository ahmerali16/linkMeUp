import React from "react";
import "./NavBar.css"
import { Link } from "react-router-dom";

const NavBar=()=>{
    return( 
        <React.Fragment>
        <div className="navBar">
            <div className='navBar-box'>
               <Link style={{textDecoration:'none'}} to="/"><div className="logoText-box">
                    <img src="./Link Me Up Logo.png" alt="Website Logo"/>
                    <h2 style={{color:'black'}}>Link Me Up</h2>
                </div></Link>
                <h1>Welcome To Our Admin Portal</h1>
            </div>
        </div>
        </React.Fragment>
    );
}

export default NavBar