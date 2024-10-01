import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import General from './Components/General/general';
import ProviderApproval from './Components/Provider_Approval/providerApproval';
import PackageApproval from './Components/Package_Approval/packageApproval';
import SignUp from './Components/SignUp/signUp';
import NavBar from './Components/NavBar/NavBar';
import SignIn from './Components/SignIn/signIn';
import { useEffect, useState } from 'react';
import SideBar from './Components/SideBar/sideBar';

function App() {

  const [user, setLoginUser] = useState(
    JSON.parse(localStorage.getItem('user')) || {}
  )

  useEffect( () => {
    if(user&&user._id) {localStorage.setItem('user', JSON.stringify(user))}
    else {localStorage.removeItem('user')}
  },[user])
    
  return (
    <Router>
      {(user&&user._id)? (
        <>
        <SideBar user={user} setLoginUser={setLoginUser}/>
        <Routes>
          {/* <Route exact path="/Dashboard" element={<General user={user} setLoginUser={setLoginUser}/>}/> */}
          <Route exact path="/ProviderApproval" element={<ProviderApproval user={user}/>}/>
          <Route exact path="/PackageApproval" element={<PackageApproval user={user}/>}/>
        </Routes>
        </>
      ):(
        <>
        <NavBar/>
         <Routes>
            <Route exact path='/' element={<SignIn setLoginUser={setLoginUser}/>}/>
            <Route exact path='/SignUp' element={<SignUp/>}/>
         </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
