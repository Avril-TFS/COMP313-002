// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isAuthenticated }) => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="navbar-logo">
          NaviGrade
        </div>
        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/courses">Courses</Link>
              <Link to="/assignments">Assignments</Link>
              {/* You can add more links for authenticated users */}
            </>
          )}
        </div>
      </nav>
      <div className="landing-content">
        {isAuthenticated ? (
          <>
            <h1>Welcome back to NaviGrade</h1>
            <p>Your personal academic companion</p>
            <Link to="/courses">
              <button>Explore Courses</button>
            </Link>
          </>
        ) : (
          <>
            <h1>Welcome to NaviGrade</h1>
            <p>Your personal academic companion</p>
            <Link to="/login">
              <button>Login to Explore</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

