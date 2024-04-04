// components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';
import Footer from '../../components/Footer';

const Login = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const success = await signin(email, password);

      if (success) {
        // Redirect to the home page after successful login
        navigate('/');
      } else {
        // Display an error message to the user indicating the login failure
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during signin:', error);
    }
  };

  return (
    <div className="container mb-5">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-xl-10">
          <div className="card">
            <div className="card-header custom-header text-white text-center">
              <h2>Login</h2>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="button" className="btn btn-primary btn-block login-button" onClick={handleLogin}>
                  Login
                </button>
              </form>
            </div>
            {error && <div className="card-footer text-center"><p style={{ color: 'red' }}>{error}</p></div>}
            <div className="card-footer text-center">
              <p>Don't have an account? <Link to="/students/signup">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;