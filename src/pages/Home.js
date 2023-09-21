import axios from "axios";
import Button from 'react-bootstrap/Button';
import React, { useState } from "react";


const Home = () => {
  const [message, setMessage] = useState([]);
  const username = localStorage.getItem("username");
  async function getUsers(e) {
    e.preventDefault();
    try{
        const response = await axios.get('http://localhost:5001/api/users/all/');
        console.log(response.data);
        // setMessage(JSON.stringify(response.data));
        setMessage(response.data);
        // setMessage(JSON.parse(response.data));

    } catch (error) {
        console.log(error.response.data.message);
        setMessage("");
    }
  }
  return (
    <div>
      {username? <h2>Welcome: {username}</h2> : <h2> Please Log in or register</h2>}
      <Button onClick={getUsers}>USERS</Button>
      <table>
        {message.map((item, index) => (
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
};
  
  export default Home;