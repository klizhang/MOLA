import { useState, useEffect } from 'react';
import axios from "axios";
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

function Admin() {
  const [predefined, setPredefined] = useState('');
  const [current, setCurrent] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  const getAllUsers = async () => {
    const response = await axios.get('http://localhost:5001/api/users/all/');
    const data = await response.data;
    const users_set = new Set();
    const admins_set = new Set();
    for (let i of data) {
      if (i.admin) {
        admins_set.add(i);
      }
      else{
        users_set.add(i);
      }
    }
    setUsers(Array.from(users_set));
    setAdmins(Array.from(admins_set));
};

  useEffect(() => {
    const checkAdmin = async () => {
        const response = await axios.get('http://localhost:5001/api/users/admin/' + localStorage.getItem("email"));
        const data = await response.data;
        // setAdmin(data.admin);
        // console.log(data.admin);
        setIsAdmin(data.admin);
        setCurrent(localStorage.getItem("email"));
        setPredefined("admin@mola.lab");
    }
    checkAdmin();
    getAllUsers();
  }, []);

  async function handleEdit(input) {
    console.log(input);
    if (!input.admin) {
      const response = await axios.post('http://localhost:5001/api/users/promote_admin/',input);
      const data = await response.data;
      console.log(data);
    }
    else{
      const response = await axios.post('http://localhost:5001/api/users/demote_admin/',input);
      const data = await response.data;
      console.log(data);
    }
    getAllUsers();
  }

  function EditDropdown (props) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Actions
        </Dropdown.Toggle>
        <Dropdown.Menu>
        {props.account.admin ? <Dropdown.Item onClick={()=> handleEdit(props.account)}>Demote Admin</Dropdown.Item> : <Dropdown.Item onClick={()=> handleEdit(props.account)}>Promote Admin</Dropdown.Item>}
      </Dropdown.Menu>
      </Dropdown>
    );
  }

  async function filterSearch(search_item) {
    const response = await axios.get('http://localhost:5001/api/users/all/');
    const data = await response.data;
    const users_set = new Set();
    const admins_set = new Set();
    for (let i of data) {
      if (i.admin) {
        admins_set.add(i);
      }
      else{
        users_set.add(i);
      }
    }
    setUsers(Array.from(users_set).filter(x=>x.email.includes(search_item)));
    setAdmins(Array.from(admins_set).filter(x=>x.email.includes(search_item)));
  }

  function handleSearch(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson.search);
    if (formJson.search === "") {
      getAllUsers();
      console.log("here");
    }
    else{
      filterSearch(formJson.search);
    }
  }

  return (
    <>
    <div className='mx-5'>
      <Form onSubmit={handleSearch}>
        <Form.Group className="my-3 w-50 mx-auto" controlId="searchGroup">
            <Form.Control name="search" type="text" placeholder="Search" />
        </Form.Group>
      </Form>


    </div>
    <div className='mx-5'>
      <h2>Admins</h2>
      {admins.length !== 0 ? 
      <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Email</th>
          <th>Date Created</th>
          <th>Admin Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {isAdmin && admins.map((admin,index) => (
        <tr key={admin._id}>
          <td>{index+1}</td>
          <td>{admin.email}</td>
          <td>{admin.createdAt}</td>
          <td>{admin.admin ? "yes" : "no"}</td>
          {
          (() => {
            if (admin.email === predefined && admin.email === current){
              return <td>You are Predefined Admin</td>
            }
            if (admin.email === predefined) {
              return <td>Predefined User</td>
            }
            if (admin.email === current) {
              return <td> You </td>
            }
            else {
              return <td><EditDropdown account={admin} /></td>
            }
          })()
        }
        </tr>
      ))}
      </tbody>
    </Table>
    :<h5>No admins</h5>}
    </div>
    <div className='mx-5'>
      <h2>Users</h2>
      {users.length !== 0 ? 
      <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Email</th>
          <th>Date Created</th>
          <th>Admin Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {isAdmin && users.map((user,index) => (
        <tr key={user._id}>
          <td>{index+1}</td>
          <td>{user.email}</td>
          <td>{user.createdAt}</td>
          <td>{user.admin ? "yes" : "no"}</td>
          <td><EditDropdown account={user} /></td>
        </tr>
      ))}
      </tbody>
    </Table>
    :<h5>No users</h5>}
    </div>
    </>
    
  );
}

export default Admin;