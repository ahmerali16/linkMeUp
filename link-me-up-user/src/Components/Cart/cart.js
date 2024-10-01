import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./cart.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Cart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState();

  const [modalIsOpen, setIsOpen] = useState(false);

  const [cartDetails, setCartDetails] = useState();

  const cartLength = cartDetails
    ? cartDetails.reduce((total, cartItem) => {
        return total + cartItem.packageDetails.length;
      }, 0)
    : 0;
  const approval_check = cartDetails?.every((pckg) =>
    pckg.packageDetails.every((approval) => approval.isApproval === true)
  );

  useEffect(() => {
    axios
      .get(`http://localhost:9002/Cart/GetCartDetailsForConsumer/${id}`)
      .then((response) => setCartDetails(response.data))
      .catch((error) =>
        console.error("Getting Error in Package Details in Cart" + error)
      );
  }, [id]);

  const totalPrice = cartDetails?.reduce((total, pckg) => {
    return (
      total +
      pckg.packageDetails.reduce((acc, details) => {
        return acc + parseInt(details.packageID.price);
      }, 0)
    );
  }, 0);

  const button_color =
    approval_check && cartLength > 0
      ? "transaction-button-enabled"
      : "transaction-button-disabled";
  const button_name =
    approval_check && cartLength > 0 ? "Pay Now" : "Waiting For Approval";

  const handleDelete = (cartID) => {
    axios
      .delete(`http://localhost:9002/Cart/DeletePackageFromCart/${cartID}`)
      .then((response) => alert(response.data.message))
      .catch((error) =>
        console.error("Getting Error in deleting package from cart" + error)
      );
  };

  const handleTransaction = (userID, ispID) => {
    const packageIDs = cartDetails?.flatMap((pckg) =>
      pckg.packageDetails.map((ids) => ids.packageID._id)
    );

    const ReceiptData = new FormData();
    ReceiptData.append("PaymentReceipts", receipt);
    packageIDs.forEach(id => {
      ReceiptData.append('packageIDs',id)
    })

    axios.post(`http://localhost:9002/Consumer/MakePayment/${userID}/${ispID}`,ReceiptData)
    .then(response => {
      alert(response.data.message)
      closeModal()
      navigate("/MyPackages")
    })
    .catch(error => console.error("Getting Error in uploading payment receipt"+error))
  };

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <div className="main-boxx">
        <div
          style={{
            width: "100%",
            height: "auto",
            padding: "30px 20px",
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "4rem",
          }}
        >
          <div className="cart-render-box">
            {cartDetails?.map((pckg) => (
              <>
                {pckg.packageDetails?.map((details) => (
                  <div className="cart-details" key={pckg._id}>
                    <div className="packagePicture-packageDetails">
                      <img
                        src={
                          details.packageID.packageProfile
                            ? `http://localhost:9002/ProviderPackages/${details.packageID.packageProfile}`
                            : "../NoImage.jpg"
                        }
                        alt="Package Profile"
                      />
                      <div className="packageName-packageProvider">
                        <h4 style={{marginTop:'5px'}}>{details.packageID.packageName}</h4>
                        <h5 style={{marginTop:'5px'}}>{details.packageID.duration}</h5>
                        <h5 style={{marginTop:'5px'}}>{pckg.ispID.ispName}</h5>
                      </div>
                    </div>
                    <h4>{details.packageID.price}</h4>
                    <img
                      src="../trash.png"
                      alt="Delete Icon"
                      onClick={() => handleDelete(details._id)}
                    />
                  </div>
                ))}
              </>
            ))}
          </div>
          <div className="package-summary">
            <h3>Package Summary</h3>
            <div className="subtotal">
              <h4 style={{ color: "gray", fontWeight: "300" }}>
                Subtotal ({cartLength} Packages)
              </h4>
              <h4>Rs. {totalPrice}</h4>
            </div>
            <div className="platform-charges">
              <h4 style={{ color: "gray", fontWeight: "300" }}>
                Platform Charges
              </h4>
              <h4>Free</h4>
            </div>
            <div className="total-price">
              <h4 style={{ color: "gray", fontWeight: "300" }}>Total</h4>
              <h4>Rs. {totalPrice}</h4>
            </div>
            <hr className="seperator" />
            <button className={button_color} onClick={openModal}>
              {button_name}
            </button>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="my-custom-modal"
          overlayClassName="my-custom-overlay"
        >
          <div className="payment-gateway">
            <h2>Account Details</h2>

            {cartDetails?.map((details) => (
              <>
                {details.ispID.accountDetails.map((account) => (
                  <div className="pg-1">
                    <label>{account.bankName}</label>
                    <h5>
                      Account Title: <span>{account.accountTitle}</span>
                    </h5>
                    <h5>
                      Account No: <span>{account.accountNumber}</span>
                    </h5>
                  </div>
                ))}
                <div className="pg-2">
                  <input
                    type="file"
                    onChange={(e) => setReceipt(e.target.files[0])}
                  />
                  <button
                    onClick={() => handleTransaction(id, details.ispID._id)}
                  >
                    Upload Receipt
                  </button>
                </div>
              </>
            ))}
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Cart;
