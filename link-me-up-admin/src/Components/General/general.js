import React from "react";
import './general.css';


const General = () => {
    return(
        <React.Fragment>
            <div className="main-box">
                <div className="stats">
                    <div>
                        <h3>120</h3>
                        <p>Total Providers</p>
                    </div>
                    <hr/>
                    <div>
                        <h3>32</h3>
                        <p>Total Consumers</p>
                    </div>
                   
                    {/* <div>
                        <h3>2</h3>
                        <p>Pending</p>
                    </div> */}
                </div>

                <div className=""></div>
            </div>
        </React.Fragment>
    );
}

export default General     