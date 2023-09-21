import Nav from 'react-bootstrap/Nav';
import { Outlet } from "react-router-dom";
import React, {Component} from 'react';


class Navigation extends Component{
  constructor(props){
    super(props);
    this.state = {
      user: "NONE",
    }
    this.showLoggedIn = this.showLoggedIn.bind(this);
  }

  

  showLoggedIn(user,isAdmin) {
    if (!user || user === ""){
      return (
        <>
          <Nav.Item>
            <Nav.Link href="/register" eventKey="link-1"> Sign up</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/login" eventKey="link-2"> Log In</Nav.Link>
          </Nav.Item>
          
        </>
      );
    }
    if (user && isAdmin === "true") {
        return (
          <>
            <Nav.Item>
              <Nav.Link href="/profile" eventKey="link-3"> Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/admin" eventKey="link-4"> Admin</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/logout" eventKey="link-5"> Log Out</Nav.Link>
              {/* <Nav.Link href="/login" eventKey="link-1">Log In</Nav.Link> */}
            </Nav.Item>
          </>
        )
    }

    return (
      <>
        <Nav.Item>
          <Nav.Link href="/profile" eventKey="link-3"> Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/logout" eventKey="link-5"> Log Out</Nav.Link>
          {/* <Nav.Link href="/login" eventKey="link-1">Log In</Nav.Link> */}
        </Nav.Item>
      </>
    );
  };
  render() {
    const user = localStorage.getItem("userID");
    const isAdmin = localStorage.getItem("isAdmin");

    // this.setState({isAdmin : localStorage.getItem("isAdmin")});
    // console.log(this.state.isAdmin);

    return (
      
      <div>

        <Nav className="float-end" variant="underline" >
          <Nav.Item>
            <Nav.Link href="/"> Publications</Nav.Link>
          </Nav.Item>
          {this.showLoggedIn(user,isAdmin)}
          
          
        </Nav>
        <Outlet />
      </div>
      // <div>
      //   <Nav variant="underline" >
      //     <Nav.Item>
      //       <Nav.Link href="/">Home</Nav.Link>
      //     </Nav.Item>
      //     <Nav.Item>
      //       <Nav.Link href="/login"eventKey="link-1">Log In</Nav.Link>
      //     </Nav.Item>
      //     <Nav.Item>
      //       <Nav.Link href="/register" eventKey="link-2">Register</Nav.Link>
      //     </Nav.Item>
      //     <Nav.Item>
      //       <Nav.Link href="/mycontacts" eventKey="link-3">  My Contacts</Nav.Link>
      //     </Nav.Item>
      //   </Nav>
      //   <Outlet />
      // </div>
      
    );
  }
}
// function Navigation() {
//   const user = localStorage.getItem("userID");
//   // showLoggedIn(user) {
//   //   if (!user || user == ""){
//   //     return (
//   //       <><Nav.Item>
//   //         <Nav.Link href="/login" eventKey="link-1">Log In</Nav.Link>
//   //       </Nav.Item><Nav.Item>
//   //           <Nav.Link href="/register" eventKey="link-2">Register</Nav.Link>
//   //         </Nav.Item></>
//   //     );
//   //   }
//   //   return (
//   //     <Nav.Item>
//   //         <Nav.Link href="/login"eventKey="link-1">Log In</Nav.Link>
//   //     </Nav.Item>
//   //   );
//   // };
//   return (
//     <div>
//       <Nav variant="underline" >
//         <Nav.Item>
//           <Nav.Link href="/">Home</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link href="/login"eventKey="link-1">Log In</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link href="/register" eventKey="link-2">Register</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link href="/mycontacts" eventKey="link-3">  My Contacts</Nav.Link>
//         </Nav.Item>
//       </Nav>
//       <Outlet />
//     </div>
    
//   );
// }

export default Navigation;