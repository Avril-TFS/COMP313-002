// App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Courses from './pages/Courses/Courses';
import Assignments from './pages/Assignments/Assignments';
import SignIn from './pages/Login/Login';
import SignUp from './components/SignUp';
import MyPage from './components/MyPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignUp = () => {
    // Handle sign-up success, you can update state or perform any action
    setIsAuthenticated(true);
  };
  console.log('handleSignUp function:', handleSignUp);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
        <Route path="/courses" element={<Courses isAuthenticated={isAuthenticated} />} />
        <Route path="/assignments" element={<Assignments isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </>
  );
}

export default App;




