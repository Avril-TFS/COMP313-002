// Dashboard.js

import React from "react";
import { Button } from "react-bootstrap";
import { fetchAssignments } from "../../services/dataFetcher";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchAssignments();
  }, []);

  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // add leading zero if minutes < 10
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const fetchAssignments = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`${apiKey}/assignments`);
      const fetchedAssignments = response.data;

      // Fetch course names for each assignment
      const updatedAssignments = await Promise.all(
        fetchedAssignments.map(async (assignment) => {
          const courseResponse = await axios.get(
            `${apiKey}/courses/${assignment.course}`
          );
          const courseName = courseResponse.name;
          return { ...assignment, course: courseName };
        })
      );

      setAssignments(updatedAssignments);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="dashboard-container mx-auto">
      <h2>Dashboard</h2>
      <Button variant="primary">Add Assignment</Button>

      {assignments.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <ul className="list-group mt-3">
          {assignments.map((assignment) => (
            <li key={assignment._id} className="list-group-item">
              <h3>{assignment.name}</h3>
              <p className="mb-1">
                Due Date: {formatDateToMDYY(assignment.dueDate)}
              </p>
              {/* Additional assignment details can be displayed here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;