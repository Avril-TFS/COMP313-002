// SignUp.js
import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    console.log('onSignUp before check:', onSignUp);
    console.log('username:', username);
    console.log('password:', password);

    try {
      if (typeof onSignUp !== 'function') {
        throw new Error('onSignUp is not a function');
      }

      const response = await axios.post('http://localhost:5000/api/register', { username, password });
      console.log('Response:', response);

      if (response.data) {
        setError(null);
        console.log('Calling onSignUp...');
        onSignUp(response.data);
      } else {
        console.warn('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;


