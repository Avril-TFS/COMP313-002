// Login.js
import React, { useState } from 'react';
import SignIn from '../../components/SignIn';  
import SignUp from '../../components/SignUp';  

const Login = ({ isAuthenticated }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div>
      <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
      {isAuthenticated ? (
        <>
          {/* Content for authenticated user */}
          <p>Welcome! You are already signed in.</p>
        </>
      ) : (
        <>
          {/* Display sign-in or sign-up form */}
          {isSignIn ? <SignIn /> : <SignUp />}
          <p>
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={toggleForm}>
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default Login;
