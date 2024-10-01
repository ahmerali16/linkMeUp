import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import LandingPage from "./Components/Landing-Page/LandingPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Karachi from "./Components/Cities/karachi";
import Lahore from "./Components/Cities/lahore";
import Islamabad from "./Components/Cities/islamabad"
import Hyderabad from "./Components/Cities/hyd"
import Cart from './Components/Cart/cart'
import SignIn from "./Components/SignIn/SignIn";
import SignUp from "./Components/SignUp/SignUp";
import Profile from "./Components/Profile/Profile"
import SystemRequest from "./Components/System_Request/SystemRequest"
import MyPackages from "./Components/My_Packages/MyPackages"


function App() {
  const [user, setLoginUser] = useState(
    JSON.parse(localStorage.getItem('user')) || {}
  );

  useEffect(() => {
    if(user&&user._id) { localStorage.setItem('user', JSON.stringify(user)) }
    else { localStorage.removeItem('user') }
  }, [user]);
  return (
  <>
  <Router>
    <Navbar user={user} setLoginUser={setLoginUser}/>
    <Routes>
      <Route exact path="/" element={<LandingPage user={user}/>}/>
      <Route exact path="/Karachi" element={<Karachi user={user}/>}/>
      <Route exact path="/Lahore" element={<Lahore/>}/>
      <Route exact path="/Islamabad" element={<Islamabad/>}/>
      <Route exact path="/Hyderabad" element={<Hyderabad/>}/>
      {(user&&user._id)?
        (<>
          <Route exact path='/Cart/:id' element={<Cart user={user}/>}/>
          <Route exact path="/Profile" element={<Profile user={user} setLoginUser={setLoginUser}/>}/>
          <Route exact path="/SystemRequest" element={<SystemRequest user={user}/>}/>
          <Route exact path="/MyPackages" element={<MyPackages user={user}/>}/>
        </>)
        :
        (<>
          <Route exact path="/SignIn" element={<SignIn user={user} setLoginUser={setLoginUser}/>}/>
          <Route exact path="/SignUp" element={<SignUp/>}/>
        </>)
       }
    </Routes>
  </Router>
  </>
  );
}

export default App;
