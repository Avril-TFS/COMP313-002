// MyPage.js
import React from 'react';
import SignUp from './SignUp'; // Ensure correct import statement

const MyPage = () => {
  const handleSignUp = (responseData) => {
    console.log('Sign-up successful!', responseData);
  };

  console.log('handleSignUp function:', handleSignUp);

  return (
    <div>
      <h1>Welcome to My Page</h1>
      <SignUp onSignUp={handleSignUp} />
    </div>
  );
};

export default MyPage;