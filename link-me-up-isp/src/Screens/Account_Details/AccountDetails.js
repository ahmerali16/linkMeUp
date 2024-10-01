import React, { useState } from "react";
import "./AccountDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AccountDetails = () => {

    const navigate = useNavigate();
    const {email} = useParams();
    const [numAccounts, setNumAccounts] = useState(1);
    const [accounts, setAccounts] = useState([{ 
            bankName: '', 
            accountTitle: '', 
            accountNumber: '' 
        }]);

    const handleNumAccountsChange = eventTriggered => {
        const value = parseInt(eventTriggered.target.value, 10);
        if (value >= 1 && value <= 5) {
            setNumAccounts(value);
            setAccounts(Array(value).fill().map(() => ({ bankName: '', accountTitle: '', accountNumber: '' })));
        }
    };

    const handleAccountChange = (index, field, value) => {
        const newAccounts = accounts.map((account, i) => 
          i === index ? { ...account, [field]: value } : account
        );
        setAccounts(newAccounts);
      };

      const Submit = () => {
        console.log(accounts)
        axios.put(`http://localhost:9002/Provider/AccountDetails/${email}`,{accounts})
        .then(response => {
            alert(response.data.message)
            navigate("/")
        })
        .catch(error => console.error("Getting error in uploading account details: "+error))
      }

    return(
        <React.Fragment>
            <div className="main-box">
                <div className="sign-box">
                    <h1>Account Details</h1>
                    <div className="fileds">
                        <input type="number" value={numAccounts} onChange={handleNumAccountsChange} min="1" max="5"/>
                        {accounts.map((account, index) => (
                            <React.Fragment>
                                <h3>Account {index + 1}</h3>
                                <label style={{
                                    position: 'absolute',
                                    left: '2.6rem',
                                    top: '5rem',
                                    fontSize: 'small'
                                }}>Enter Number of Accounts(1-5)</label>
                                <input type="text" value={account.bankName} placeholder="Enter Bank Name" onChange={(e) => handleAccountChange(index, 'bankName', e.target.value)}/>
                                <input type="text" value={account.accountTitle} placeholder="Enter Account Title" onChange={(e) => handleAccountChange(index, 'accountTitle', e.target.value)}/>
                                <input type="text" value={account.accountNumber} placeholder="Enter Account Number" onChange={(e) => handleAccountChange(index, 'accountNumber', e.target.value)}/>
                            </React.Fragment>
                        ))}
                    </div>
                    {numAccounts > 0 && <button onClick={Submit}>Submit</button>}
                </div>
            </div>
        </React.Fragment>
    )
}

export default AccountDetails