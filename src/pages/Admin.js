import { useState, useEffect } from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button';


function Admin() {
  // Initialize the state to an empty array of todos.
  const [isAdmin, setAdmin] = useState();
  const [users, setUsers] = useState([]);

  useEffect(() => {

    const checkAdmin = async () => {
        const response = await axios.get('http://localhost:5001/api/users/admin/' + localStorage.getItem("email"));
        const data = await response.data;
        // setAdmin(data.admin);
        console.log(data.admin);
        setAdmin(data.admin);
    }

    const getUsers = async () => {
        const response = await axios.get('http://localhost:5001/api/users/all/');
        const data = await response.data;
        setUsers(data);
    };
    checkAdmin();
    getUsers();

  }, []);

//   console.log(todos);

  return (
    
    <div>
      {isAdmin && users.map((user) => (
        <div key={user.email}>
          <h2>Email: {user.email}</h2>
          <h2>Created: {user.createdAt}</h2>
          <h2>Admin: {user.admin ? "yes" : "no"}</h2>
          <Button>Edit</Button>
        </div>
      ))}
    </div>
  );
}

export default Admin;