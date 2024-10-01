import React, { useState } from "react";
import "./UploadPackage.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadPackage = ({user}) => {

    const navigate = useNavigate();
    const [uploadPackage, setPackageDetails] = useState({
        ispID: user._id,
        packageName: "",
        duration: "",
        price: 0,
        description: ""
    });

    const [packageProfile, setPackageProfile] = useState()

    const handleChange = eventTriggered => {
        const {name, value} = eventTriggered.target;
        setPackageDetails({
            ...uploadPackage,
            [name] : value
        });
    }

    const UploadPackagee = () => {
        const PackageData = new FormData();
        Object.entries(uploadPackage).forEach(([key, value]) => {PackageData.append(key, value)});
        PackageData.append("PackageProfile", packageProfile);
        const {ispID, packageName, price, duration, description} = uploadPackage
        if(ispID && packageName && duration && price && description){
            axios.post("http://localhost:9002/Package/UploadPackage", PackageData)
            .then(response => {
                alert(response.data.message)
                navigate("/MyPackage")
            })
            .catch(error => console.error("Getting Error in Uploading Package: "+error))
        }
        else alert("Please fill all fields")
    }

    return(
        <React.Fragment>
            <div className="main-box" style={{width:'82vw', float:'right'}}>
                <div className="sections-box">
                    <h2>Upload Package</h2>
                    <label style={{top:'6rem'}}>Name</label>
                    <input name="packageName" value={uploadPackage.packageName} type="text" onChange={handleChange}/>
                    <label style={{top:'12.8rem'}}>Enter duration in days</label>
                    <input name="duration" value={uploadPackage.duration} type="number" onChange={handleChange}/>
                    <label style={{top:'19.6rem'}}>Price</label>
                    <input name="price" value={uploadPackage.price} type="number" onChange={handleChange}/>
                    <input type="file" onChange={e => setPackageProfile(e.target.files[0])}/>
                    <label style={{top:'32.9rem'}}>Description</label>
                    <textarea name="description" value={uploadPackage.description} onChange={handleChange}/>
                    <button style={{width:'736px', height:'69px', fontSize:'36px'}} onClick={UploadPackagee}>Upload Package</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default UploadPackage