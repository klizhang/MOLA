import "./App.css";
import Navigation from './pages/Navigation';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from './pages/Home';
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Publications from "./pages/Publications";
// import Admin from "./pages/Admin";
import Admin from "./pages/Admin";
import Logout from "./pages/Logout";
import React, { Component } from "react";
import Profile from "./pages/Profile";
// import React, {useState} from 'react';

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigation />}>
//           <Route index element={<Home />} />
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />
//           <Route path="mycontacts" element={<Contacts />} />
//           <Route path="*" element={<NoPage />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//     </div>
//   );
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "NONE",
    }
    this.handler = this.handler.bind(this)
  }
  handler(updated){
    this.setState({
      user: updated
    })
  }

  render() {
    // const user = this.state.user;
    // console.log(localStorage.getItem("userID"));
    // const user = localStorage.getItem("userID");
    // if(localStorage.getItem("userID")){
    //   this.handler("Success")
    // }
    // else{
    //   this.handler("Fail")
    // }
    // this.handler(localStorage.getItem("userID")? localStorage.getItem("userID") : "")
    return(
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigation />}>
              <Route index element={<Publications />} />
              <Route path="login" element={<Login handler={this.handler}/>} />
              {/* <Route path="login" element={<Login />} /> */}
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              {/* {if user? <Route path="register" element={<Register />} /> : } */}
              {/* <Route path="mycontacts" element={<Publications />} /> */}
              {/* <Route path="admin" element={<Admin />} /> */}
              <Route path="admin" element={<Admin />} />

              <Route path="logout" element={<Logout handler={this.handler}/>} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    ); 
  }
}

// const App = () =>{
//   const[state,setState] = useState('');
//   return(
//     <div className="App">
//        <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigation />}>
//             <Route index element={<Home />} />
//             <Route path="login" element={<Login state={state} stateChanger={setState}/>} />
//             <Route path="register" element={<Register />} />
//             <Route path="mycontacts" element={<Contacts />} />
//             <Route path="*" element={<NoPage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }


export default App