import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
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

    setLoginError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setSuccessMessage('User Logged In Successfully!');
      setLoginError('');

      // Delay redirection to let user see message
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 2000); // 2 seconds
    } catch (err) {
      setLoginError('Either email or password is incorrect.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign In</h2>

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

        {loginError && <div className="error-message">{loginError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SignIn;