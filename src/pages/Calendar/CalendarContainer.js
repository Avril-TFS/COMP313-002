//CalendarContainer.js
import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import "./Calendar.css"

const CalendarContainer = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;


  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchCourses = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`${apiKey}/courses`);
      const fetchedCourses = response.data;
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`${apiKey}/assignments`);
      const fetchedAssignments = response.data;
      setAssignments(fetchedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  return (
    <div>
      <h1>Course Calendar</h1>
      <Calendar courses={courses} assignments={assignments} />
    </div>
  );
};

export default CalendarContainer;
