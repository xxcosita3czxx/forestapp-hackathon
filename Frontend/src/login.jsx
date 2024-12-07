// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  const [error, setError] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    username: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loginFieldErrors, setLoginFieldErrors] = useState({
    email: '',
    password: ''
  });
  const [attemptedNextStep, setAttemptedNextStep] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Clear field-specific error
    setLoginFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/auth/login', {
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
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/auth/register', {
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
        // Auto login after registration
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

  const validateStep1 = () => {
    const errors = {};
    if (!credentials.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!credentials.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!birthDate) {
      errors.birthday = 'Date of birth is required';
    }
    setFieldErrors(prev => ({...prev, ...errors}));
    return Object.keys(errors).length === 0;
  };

  const validateLogin = () => {
    const errors = {};
    if (!credentials.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!credentials.password.trim()) {
      errors.password = 'Password is required';
    }
    setLoginFieldErrors(prev => ({...prev, ...errors}));
    return Object.keys(errors).length === 0;
  };

  const renderRegistrationStep1 = () => {
    const handleNextClick = () => {
      setAttemptedNextStep(true);
      if (validateStep1()) {
        setRegistrationStep(2);
      }
    };

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
            className={`auth-input ${attemptedNextStep && fieldErrors.fullName ? 'error' : ''}`}
            value={credentials.fullName}
            onChange={handleChange}
            required
          />
          {attemptedNextStep && fieldErrors.fullName && 
            <span className="error-message">{fieldErrors.fullName}</span>
          }
        </div>
        <div className="input-group">
          <label className="input-label">Username</label>
          <input
            type="text"
            name="username"
            className={`auth-input ${attemptedNextStep && fieldErrors.username ? 'error' : ''}`}
            value={credentials.username}
            onChange={handleChange}
            required
          />
          {attemptedNextStep && fieldErrors.username && 
            <span className="error-message">{fieldErrors.username}</span>
          }
        </div>
        <div className="input-group">
          <label className="input-label">Date of Birth</label>
          <DatePicker
            selected={birthDate}
            onChange={(date) => {
              setBirthDate(date);
              setFieldErrors(prev => ({ ...prev, birthday: '' }));
            }}
            className={`auth-input ${attemptedNextStep && fieldErrors.birthday ? 'error' : ''}`}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            required
          />
          {attemptedNextStep && fieldErrors.birthday && 
            <span className="error-message">{fieldErrors.birthday}</span>
          }
        </div>
        <button 
          type="button" 
          className="auth-button"
          onClick={handleNextClick}
        >
          Next
        </button>
      </>
    );
  };

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
          required
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
          required
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
          required
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
        <button type="submit" className={`auth-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
          {isLoading ? <span className="loading-spinner"></span> : 'Register'}
        </button>
      </div>
    </>
  );

  // Add token to all API requests
  const makeRequest = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/protected-route', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

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
          <form onSubmit={(e) => {
            e.preventDefault();
            if (validateLogin()) {
              handleLogin(e);
            }
          }}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                className={`auth-input ${loginFieldErrors.email ? 'error' : ''}`}
                required
              />
              {loginFieldErrors.email && <span className="error-message">{loginFieldErrors.email}</span>}
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className={`auth-input ${loginFieldErrors.password ? 'error' : ''}`}
                required
              />
              {loginFieldErrors.password && <span className="error-message">{loginFieldErrors.password}</span>}
            </div>
            <button type="submit" className={`auth-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner"></span> : 'Login'}
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