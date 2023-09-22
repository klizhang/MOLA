import React, { Component } from "react";

class Logout extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: props.user,
        };
        this.logout = this.logout.bind(this);
    }
    logout(){
      localStorage.setItem("userID","");
      localStorage.removeItem("username");
      localStorage.setItem("isAdmin",null);
      localStorage.removeItem("email");

    }
    componentDidMount() {
      this.props.handler("Blank");
    }
    render() {
      this.logout();
      return (
          <h1>You have logged out</h1>
      )
    }
}
  
  export default Logout;