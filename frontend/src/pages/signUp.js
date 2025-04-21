// signUp.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.css';


const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'email') {
      if (!validateEmail(value)) {
        setEmailError('Please Enter a Valid Email Address!');
      } else {
        setEmailError('');
      }
    }

    setSignupError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/auth/signup', form);
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setSignupError('Signup failed. Try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign Up</h2>

        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {emailError && <div className="error-message">{emailError}</div>}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {signupError && <div className="error-message">{signupError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignUp;
