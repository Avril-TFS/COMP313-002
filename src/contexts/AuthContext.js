// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const checkState = localStorage.getItem("token") ? true : false;
const checkUserState = localStorage.getItem("user")
  ? localStorage.getItem("user")
  : null;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(checkState);
  const [userDetails, setUserDetails] = useState(checkUserState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const TOKEN_KEY = "token";
  const USER_KEY = "user";

  // Function to set the authentication token in localStorage
  const setAuthToken = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, user);
  };

  // Function to get the authentication token from localStorage
  const getAuthToken = () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  };

  const setUserInfo = (user) => {
    localStorage.setItem(USER_KEY, user);
  };

  const getUserDetails = () => {
    if (!localStorage.getItem(USER_KEY)) {
      return null;
    }
    return localStorage.getItem(USER_KEY);
  };

  // Function to remove the authentication token from localStorage
  const removeAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // useEffect(() => {
  //   if (checkState) {
  //     const userDetails = getUserDetails();
  //     setUser(checkState);
  //     setUserDetails(userDetails);
  //     console.log(user, userDetails);
  //   }
  //   setUser(null);
  //   setUserDetails(null);
  // }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        signout();
      }
    }
  }, []);

  const signout = async () => {
    try {
      // Make a POST request to the server to logout
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(`${apiKey}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the token in the Authorization header
          Authorization: `Bearer ${getAuthToken()}`,
        },
        // Include any necessary authentication tokens or credentials
      });

      // Assuming a successful logout, redirect to the home page or login page
      if (response.ok) {
        // Remove both access and refresh tokens
        removeAuthToken();
        setUser(null);
        setUserDetails(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      setLoading(true);
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(`${apiKey}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const responseData = await response.json(); // This line captures the response data
      console.log("Response data:", responseData);
      if (response.ok) {
        console.log("Signup successful. User data:", responseData);
        const userjson = JSON.stringify(responseData.user);
        setAuthToken(responseData.token, userjson);
        setUser(responseData.user);
        setUserDetails(userjson);
        navigate("/home");
        return true;
      } else {
        const errorData = await response.json();
        console.error("Error during signup:", response.statusText, errorData);
        return false;
      }
    } catch (error) {
      console.error("Error during signup:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signin = async (email, password) => {
    try {
      // // Obtain the token from localStorage
      const token = getAuthToken();

      // Check if the user is already authenticated
      if (token !== null) {
        console.error(
          "User is already logged in. Please log out to switch accounts."
        );
        return false;
      }

      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(`${apiKey}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sign in successful. User data:", data);
        // Set both access and refresh tokens
        const userjson = JSON.stringify(data.user);
        setAuthToken(data.token, userjson);
        setUser(data.token);
        setUserDetails(userjson);
        navigate("/home");
        return true;
      } else {
        console.error(
          "Login failed. Please check your credentials." + response.statusText
        );
      }

      return response.ok;
    } catch (error) {
      console.error("Error during signin:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        setUser,
        setUserDetails,
        setUserInfo,
        signout,
        signup,
        signin,
        loading,
        getAuthToken,
        setAuthToken,
        removeAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
