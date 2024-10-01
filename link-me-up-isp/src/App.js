import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Screens/NavBar/NavBar';
import SignUp from './Screens/SignUp/SignUp';
import SignIn from './Screens/SignIn/SignIn';
import SideBar from './Screens/SideBar/SideBar';
import Profile from './Screens/Profile/Profile';
import MyPackage from './Screens/MyPackages/MyPackage';
import UploadPackage from './Screens/UploadPackage/UploadPackage';
import PackageApproval from './Screens/PackageApproval/PackageApproval';
import SystemRequest from './Screens/SystemRequest/SystemRequest';
import AccountDetails from './Screens/Account_Details/AccountDetails';

function App() {

  const [user, setLoginUser] = useState(
    JSON.parse(localStorage.getItem('user')) || {}
  )

  useEffect( () => {
    if(user&&user._id) {localStorage.setItem('user', JSON.stringify(user))}
    else {localStorage.removeItem('user')}
  },[user]);

  return (
    <Router>
      {(user&&user._id)?
      (<>
        <SideBar user={user} setLoginUser={setLoginUser}/>
        <Routes>
          <Route exact path='/Profile' element={<Profile user={user} setLoginUser={setLoginUser}/>}/>
          <Route exact path='/MyPackage' element={<MyPackage user={user}/>}/>
          <Route exact path='/UploadPackage' element={<UploadPackage user={user}/>}/>
          <Route exact path='/PackageApproval' element={<PackageApproval user={user}/>}/>
          <Route exact path='/SystemRequest' element={<SystemRequest user={user}/>}/>
        </Routes>
        </>)
        :
      (<>
        <NavBar/>
        <Routes>
          <Route exact path='/' element={<SignIn setLoginUser={setLoginUser}/>}/>
          <Route exact path='/SignUp' element={<SignUp/>}/>
          <Route exact path='/AccountDetails/:email' element={<AccountDetails/>}/>
        </Routes>
      </>)
      
      }
    </Router>
  );
}

export default App;
