import axios from "axios";
// import React, { Component, useState, useEffect } from "react";
import React, { Component} from "react";
import Button from 'react-bootstrap/Button';


class Admin extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: props.user,
            isLoggedIn: false,
            isAdmin: false,
            users: [],
        };
        this.checkAdmin = this.checkAdmin.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }
    componentDidMount() {
        this.checkAdmin();
        
    }
    checkAdmin = async () => {
        try{
            const response = await axios.get('http://localhost:5001/api/users/admin',localStorage.getItem("userID"));
            console.log(response.data.admin);
            if (response.data.admin === true) {
                this.setState({isAdmin : true});
            }
            else {
                this.setState({isAdmin : false});
            }
            // setMessage(JSON.stringify(response.data));
        } catch (error) {
            console.log(error.response.data.message);
        }
    }
    
    getUsers = async() => {
        try{
            const response = await axios.get('http://localhost:5001/api/users/all/');
            console.log(response.data);
            // setMessage(JSON.stringify(response.data));
            this.setState({users : response.data});
            // setMessage(JSON.parse(response.data));
        } catch (error) {
            console.log(error.response.data.message);
            this.setState({users : ""});
        }
      }

    fetchAdmin(isAdmin) {
        if (isAdmin) {
            return(
                <div>
                    <Button onClick={this.getUsers()}>USERS</Button>
                    <table>
                        {this.state.users.map((item, index) => (
                            <tbody key={index}>
                                    <tr >
                                        <td><a href = {item.href}>{item.title}</a></td>
                                    </tr>
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.username}</td>
                                        <td>{item.createdAt}</td>
                                    </tr>
                            </tbody>
                            ))
                        }
                    </table>   
                </div>
            );
        }
        return(
            <div>YOU ARE NOT ALLOWED ADMIN</div>
        );
    }
    render() {
        
        // const navigate = useNavigate();
        return (
            <div>
                {this.state.isAdmin ? <h2>you are admin</h2> : <h2> not admin</h2>}
                <this.fetchAdmin isAdmin = {this.state.isAdmin} />
            </div>
            
        )
    }
// function Admin(){
//     const [isAdmin, setIsAdmin] = useState('');

//     useEffect(() => {
//     // React advises to declare the async function directly inside useEffect
//     async function checkAdmin() {
//         const response = await axios.get('http://localhost:5001/api/users/admin',localStorage.getItem("userID"));
//         const data = await response.data;
//         console.log(data.admin)
//         if (data.admin){
//             setIsAdmin("True");
            
//         }
        
//     };

//     // You need to restrict it at some point
//     // This is just dummy code and should be replaced by actual
//     if (!isAdmin) {
//         checkAdmin();
//     }
//     }, []);

//     function renderAdmin(isAdmin) {
//         if (isAdmin === "True"){
//             return (
//                 <div> You are admin</div>
//             )
//         }
//         return(
//             <div> You are not admin</div>
//         );
//     };

//     return(

//         <renderAdmin isAdmin={isAdmin}/>


//     );
}

export default Admin;