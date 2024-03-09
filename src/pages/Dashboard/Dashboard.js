// Dashboard.js

import React from "react";
import { Button, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { useAuth } from "../../contexts/AuthContext";
import ListGroup from "react-bootstrap/ListGroup";
import "./Dashboard.css";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  const [studentName, setStudentName] = useState('');
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchAssignments();
    fetchUserName();
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
  const fetchUserName = async () =>{
    try{
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`${apiKey}/userinfo`);
      const fetchedUserId = response.data.user.userId;
      //console.log('fetchedUserId',fetchedUserId)

      const studentResponse = await axios.get(`${apiKey}/students/${fetchedUserId}`);
      const studentFirstName = studentResponse.data.firstName;
      setStudentName(studentFirstName);
      //console.log('studentName',studentFirstName);
    }catch(error){
      console.error("Error:", error);
    }
  }

  return (
    <div className="dashboard-container mx-auto">
      <h2 className="display-5">{studentName}'s Dashboard </h2>
      {/*<Button variant="primary">Add Assignment</Button>*/}
      {assignments.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <Card key={assignment._id} className="assignment-card">
              <Card.Body>
                <Card.Title>{assignment.name}</Card.Title>
                <Card.Text>Due Date: {formatDateToMDYY(assignment.dueDate)}</Card.Text>
                
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
