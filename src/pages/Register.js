import axios from "axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
const Register = () => {
  async function handleRegister(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    try{
      const response = await axios.post('http://localhost:5001/api/users/register',formJson);
      console.log(response.data);
      // setMessage(JSON.stringify(response.data));
    } catch (error) {
      console.log(error.response.data.message);
    }
  }
  return (
    // <form method="post" onSubmit={handleRegister}>
    //   <h1> REGISTER</h1>
    //   <label>
    //     username: <input name="username"/>
    //   </label>
    //   <label>
    //     Email: <input name="email"/>
    //   </label>
    //   <label>
    //     Password: <input name="password"/>
    //   </label>
    //   <button type="reset">Reset form</button>
    //   <button type="submit">Submit form</button>
    // </form>
    <Form onSubmit={handleRegister}>
      <Form.Group className="mb-3" >
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" name="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" >
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" name="password" placeholder="Password" />
      </Form.Group>

      <Form.Group className="mb-3" >
      <Form.Check type="checkbox" name="isAdmin" label="Admin" />
      </Form.Group>
      <Button variant="primary" type="submit">
      Submit
      </Button>
    </Form>
  );
  };
  
  export default Register;