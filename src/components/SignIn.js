// SignIn.js
import React, { useState } from 'react';
import axios from 'axios';

const SignIn = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      console.log(response.data);
      setError(null);
      onSignIn(); // Notify parent component about successful login
    } catch (error) {
      console.error(error.response?.data || 'Invalid username or password.');
      setError('Invalid username or password.'); // Set a more user-friendly error message
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default SignIn;


