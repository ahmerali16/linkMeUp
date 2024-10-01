import React from "react";
import "./SideBar.css";
import { Link, useNavigate } from "react-router-dom";

const SideBar = ({user, setLoginUser}) => {

    const navigate = useNavigate();

    const userName = user?.firstName+" "+user?.lastName

    const Logout = () => {
        setLoginUser({})
        navigate("/")
    }

    return(
        <React.Fragment>
            <div className="sideBar">
                <div className="logo-name">
                    <img src="./logo.png" alt="Link Me Up Logo"/>
                    <h1>link me up</h1>
                </div>

                <div className="sideBar-buttons">
                    <Link to="/Profile" style={{textDecoration:'none'}}><button>
                        <img src="./Home.svg" alt="Home Icon"/>
                        Profile
                    </button></Link>

                    <Link to="/MyPackage" style={{textDecoration:'none'}}><button>
                        <img src="./consumer approval.svg" alt="Home Icon"/>
                        My Package
                    </button></Link>

                    <Link to="/UploadPackage" style={{textDecoration:'none'}}><button>
                        <img src="./consumer approval.svg" alt="Home Icon"/>
                        Upload Package
                    </button></Link>

                    <Link to="/PackageApproval" style={{textDecoration:'none'}}><button>
                        <img src="./consumer approval.svg" alt="Home Icon"/>
                        Package Approval
                    </button></Link>

                    <Link to="/SystemRequest" style={{textDecoration:'none'}}>
                        <button>
                            <img src="./system.png" alt="System Request Icon"/>
                            System Request
                        </button>
                    </Link>

                    <button onClick={Logout}>
                        <img src="./signout.svg" alt="Home Icon"/>
                        Sign Out
                    </button>
                </div>
                <div className="admin-card">
                    <img src={user?.ispProfile? `http://localhost:9002/Provider/${user.ispProfile}`:'./logo.png'} alt="Link Me Up Logo"/>
                    <div>
                        <h4>{userName}</h4>
                        <h5>Provider</h5>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SideBar