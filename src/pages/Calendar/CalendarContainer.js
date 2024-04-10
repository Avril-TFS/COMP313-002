//CalendarContainer.js
import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CalendarContainer = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  const userInfo = JSON.parse(userDetails);
  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchCourses = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/courses/student/${userInfo.id}`
      );
      const fetchedCourses = response.data;
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/assignments/student/${userInfo.id}`
      );
      const fetchedAssignments = response.data;
      setAssignments(fetchedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  return (
    <div>
      <h1>Course Calendar</h1>
      <div>
        <GoogleOAuthProvider clientId="114259769650-eh5tmoeistfiigle8o5u0susuoe3s0d9.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={RequestCode => {
            const {credential} = RequestCode;
            axios.post('http://localhost:5050/routes/create-calendar-token', {credential}).then(response => {
              console.log(response.data);
            }).catch(error => {
              console.log(error.message);
            })
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          cookiePolicy={'single_host_origin'}
          responseType='code'
          accessType='offline'
          scope='openid email profile https://www.googleapis.com/auth/calendar'
        />
        </GoogleOAuthProvider>
        <br/>
      </div>
      <Calendar courses={courses} assignments={assignments} />
    </div>
  );
};

export default CalendarContainer;
