import React, { useEffect, useState } from "react";
import "./MyPackages.css";
import axios from "axios";

const MyPackages = ({ user }) => {
  const [receiptDetails, setReceiptDetails] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:9002/Consumer/GetReceiptForConsumer/${user._id}`)
      .then((response) => setReceiptDetails(response.data))
      .catch((error) =>
        console.error("Getting error in retrieving payement details" + error)
      );
  }, [user._id]);

  return (
    <React.Fragment>
        {console.log(receiptDetails)}
      <div className="main-boxx">
        <div className="receipt-section-box">
          <h1>Receipts</h1>
          {receiptDetails?.length > 0 ? (
            <React.Fragment>
              <div className="receipts-box">
                {receiptDetails?.map((receipt) => (
                  <>
                    {receipt.packageDetails?.map((pckg) => (
                      <div
                        className="actual-receipt"
                        style={{ paddingTop: "4rem" }}
                        key={pckg._id}
                      >
                        <div className="payment-confirm">
                          <img
                            src="./Link Me Up Logo.png"
                            alt="Payment Confirmation"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <h2>Rs. {pckg.packageID.price}</h2>
                        <h3>
                          <span style={{ fontWeight: "bold" }}>
                            {user.firstName}
                          </span>{" "}
                          to{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {receipt.ispID.ispName}
                          </span>
                        </h3>

                        <div className="additional-info">
                          <div>
                            <label>Package Name</label>
                            <h5>{pckg.packageID.packageName}</h5>
                          </div>

                          <div>
                            <label>Date of Purchase</label>
                            <h5>{pckg.dateOfPurchase}</h5>
                          </div>

                          <div>
                            <label>Valid Till</label>
                            <h5>{pckg.validTill}</h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </React.Fragment>
          ) : (
            <p>Aap ne abhi tak koi package nahin khareeda</p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default MyPackages;
