import React from "react";
import "./sideBar.css";
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
                    <img src="./Link Me Up Logo.png" alt="Link Me Up Logo"/>
                    <h1>link me up</h1>
                </div>

                <div className="sideBar-buttons">
                    {/* <Link to="/Dashboard" style={{textDecoration:'none'}}><button>
                        <img src="./Home.svg" alt="Home Icon"/>
                        General
                    </button></Link> */}

                    <Link to="/ProviderApproval" style={{textDecoration:'none'}}><button>
                        <img src="./consumer approval.svg" alt="Home Icon"/>
                        Provider Approval
                    </button></Link>

                    <Link to="/PackageApproval" style={{textDecoration:'none'}}><button>
                        <img src="./consumer approval.svg" alt="Home Icon"/>
                        Package Approval
                    </button></Link>

                    <button onClick={Logout}>
                        <img src="./signout.svg" alt="Home Icon"/>
                        Sign Out
                    </button>
                </div>
                <div className="admin-card">
                    <img src={user?.adminProfile? `http://localhost:9002/Admin/${user.adminProfile}`:'./Link Me Up Logo.png'} alt="Link Me Up Logo"/>
                    <div>
                        <h4>{userName}</h4>
                        <h5>Admin</h5>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SideBar