import { useState, useEffect } from 'react';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

function Profile() {
    // Initialize the state to an empty array of todos.
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const handlePassword = async(e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("email",user.email);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    try{
      const response = await axios.post('http://localhost:5001/api/users/change_password',formJson);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const deleteUser = async(e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("email",user.email);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    try{
      const response = await axios.post('http://localhost:5001/api/users/delete_user',formJson);
      console.log(response.data);
      navigate("/logout");
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    const findUser = async () => {
        const response = await axios.get('http://localhost:5001/api/users/admin/' + localStorage.getItem("email"));
        const data = await response.data;
        // setAdmin(data.admin);
        console.log(data);
        setUser(data);
    }
    findUser();
  }, []);

//   console.log(todos);

  return (
    
    <div className='mx-5'>
      <h1>My Profile</h1>
        <Form onSubmit={handlePassword} className='mx-5'>
          <Form.Group className="mb-3">
          <Form.Label><h3>My Email</h3></Form.Label>
          <Form.Control name="email" placeholder={user.email} disabled />
          </Form.Group>
          <Form.Label><h3>Change Password</h3></Form.Label>
          <Form.Group className="mb-3">
          <Form.Label>Current Password</Form.Label>
          <Form.Control name="current_password" placeholder="Current password"  />
          </Form.Group>
          <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control name="new_password" placeholder="New password"  />
          </Form.Group>
          <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control name="confirm_password" placeholder="Confirm new password"  />
          </Form.Group>
          <Form.Group className="mb-3">
          <Button type="submit">Change Password </Button>
          </Form.Group>
        </Form>
        <Form onSubmit={deleteUser} className='mx-5'>
        {user.email !== "admin@mola.lab" ? 
        <Form.Group className="mb-3">
          <Button variant="danger" type="submit">Delete Account </Button>
          </Form.Group>
          : <h5>You cannot delete this account since you are predefined admin</h5>
        }
        
        </Form>
    </div>
    
   
    
  );
}

export default Profile;