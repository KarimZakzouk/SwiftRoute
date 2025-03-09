import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import '../Styles/Login.css';
import logo from '../images/SwiftRoute.png';

export default function Login() {
  const [formInput, setFormInput] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const sendData = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:6969/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formInput),
      });

      const result = await response.json();
      console.log('Login response:', result.token);
      console.log(response);

      if (response.ok && result.token) {
        sessionStorage.setItem('authToken', result.token);  
        sessionStorage.setItem('ssn', result.ssn);
        sessionStorage.setItem('userType', result.type); 
        sessionStorage.setItem('id', result.id); 
        
        if (result.type === 'Manager') {
          const isVerified = result.verified_by !== null && result.verified_by !== undefined && result.verified_by !== '';
          sessionStorage.setItem('verified', isVerified);
        }
        

        console.log('Token:', result.token);
        console.log('SSN:', result.ssn);
        console.log('User Type:', result.type);
        console.log('Verified By:', result.verified_by);

        if (result.type === 'Admin') {
          navigate('/admin');
        } else if (result.type === 'Manager') {
          navigate('/manager');
        } else if (result.type === 'Driver') {
          navigate('/Driver');
        } else if (result.type === 'Passenger') {
          navigate('/Passenger');
        }
      } else {
        setError(result.message || 'Login failed. Please check your email and password.');
      }
      
    } catch (error) {
      console.error('Error sending data:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div id="Login">
      <form id="Login_box" onSubmit={sendData}>
        <img src={logo} alt="Swift Route Logo" className="logo" />

        <div id="input-container">
          <label>Email</label>
          <input
            value={formInput.email}
            type="text"
            onChange={(event) => setFormInput({ ...formInput, email: event.target.value })}
            required
            style={{ boxSizing: 'border-box' }}

          />
        </div>
        <div id="input-container">
          <label>Password</label>
          <input
            value={formInput.password}
            type="password"
            onChange={(event) => setFormInput({ ...formInput, password: event.target.value })}
            required
            style={{ boxSizing: 'border-box' }}
          />
        </div>

        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <div id="button-container">
          <button type="submit" className="button">Login</button>
          <a href="/Signup" className="button signup" style={{ textDecoration: 'none' }}>Sign Up</a>
        </div>
      </form>
    </div>
  );
}
