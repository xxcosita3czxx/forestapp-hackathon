// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './login.css';

const API_URL = 'http://localhost:8000';

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [credentials, setCredentials] = useState({
    fullName: '',
    username: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [birthDate, setBirthDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: credentials.fullName,
          username: credentials.username,
          birthday: credentials.birthday,
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Registration Step 1 (Personal Info)
  const renderRegistrationStep1 = () => {
    return (
      <>
        <div className="step-indicator">
          <span className="step active">Personal Info</span>
          <span className="step">Account Setup</span>
        </div>
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="auth-input"
            value={credentials.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Username</label>
          <input
            type="text"
            name="username"
            className="auth-input"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Date of Birth</label>
          <DatePicker
            selected={birthDate}
            onChange={(date) => {
              setBirthDate(date);
              setCredentials(prev => ({
                ...prev,
                birthday: date
              }));
            }}
            className="auth-input"
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            placeholderText="Select date"
          />
        </div>
        <button 
          type="button" 
          className="auth-button"
          onClick={() => setRegistrationStep(2)}
        >
          Next
        </button>
      </>
    );
  };

  // Registration Step 2 (Account Setup)
  const renderRegistrationStep2 = () => (
    <>
      <div className="step-indicator">
        <span className="step completed">Personal Info</span>
        <span className="step active">Account Setup</span>
      </div>
      <div className="input-group">
        <label className="input-label">Email Address</label>
        <input
          type="email"
          name="email"
          className="auth-input"
          value={credentials.email}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label className="input-label">Password</label>
        <input
          type="password"
          name="password"
          className="auth-input"
          value={credentials.password}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label className="input-label">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="auth-input"
          value={credentials.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <div className="button-group">
        <button 
          type="button" 
          className="auth-button secondary"
          onClick={() => setRegistrationStep(1)}
        >
          Back
        </button>
        <button type="submit" className="auth-button">
          Register
        </button>
      </div>
    </>
  );

  return (
    <div className="login-page">
      <h1 className="app-title">Foster App</h1>
      <div className="auth-container">
        <div className="auth-toggle">
          <button 
            className={`toggle-button ${isLoginForm ? 'active' : ''}`}
            onClick={() => {
              setIsLoginForm(true);
              setRegistrationStep(1);
            }}
          >
            Login
          </button>
          <button 
            className={`toggle-button ${!isLoginForm ? 'active' : ''}`}
            onClick={() => setIsLoginForm(false)}
          >
            Register
          </button>
        </div>

        {isLoginForm ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <button type="submit" className="auth-button">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            {registrationStep === 1 ? renderRegistrationStep1() : renderRegistrationStep2()}
          </form>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Login;