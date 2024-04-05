// Dashboard.js

import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";

import "./Dashboard.css";
///eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWUxMWY2MzQyZmRjMzQzODZiNzk1MTAiLCJpYXQiOjE3MTAxMTYxOTAsImV4cCI6MTcxMDExOTc5MH0.Xhp8W-B-7VekpbVF0sFx0PL8lliy2-YyEChXGeATV9c
const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);

  const userInfo = JSON.parse(userDetails);
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchAssignments();
  }, []);

  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    // const hours = date.getHours();
    // const minutes = date.getMinutes().toString().padStart(2, "0"); // add leading zero if minutes < 10
    return `${month}/${day}/${year} `;
  };

  const fetchAssignments = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/assignments/student/${userInfo.id}`
      );
      const fetchedAssignments = response.data;

      // Fetch course names for each assignment
      const updatedAssignments = await Promise.all(
        fetchedAssignments
          .filter((assignment) => !assignment.completed)
          .map(async (assignment) => {
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
    // <div className="dashboard-container mx-auto">
    //   <h2 className="display-5">{studentName}'s Dashboard </h2>
    //   {/*<Button variant="primary">Add Assignment</Button>*/}
    //   {assignments.length === 0 ? (
    //     <p>No assignments currently.</p>
    //   ) : (
    //     <div className="assignment-list">
    //       {assignments.map((assignment) => (
    //         <Card key={assignment._id} className="assignment-card">
    //           <Card.Body>
    //             <Card.Title>{assignment.name}</Card.Title>
    //             <Card.Text>Due Date: {formatDateToMDYY(assignment.dueDate)}</Card.Text>
    //            {/* {studentAssignments[0]} */}

    //           </Card.Body>
    //         </Card>
    //       ))}
    //     </div>
    //   )}
    // </div>

    <div className="dashboard-container mx-auto">
      <h3 className="display-5"> Dashboard for {userInfo.firstName} </h3>

      {assignments.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <div className="assignment-list">
          <p>Assignments</p>
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment._id}>
                <div>
                  <h4>{assignment.name}</h4>
                  <h4>
                    Grade: {assignment.grade !== 0 ? assignment.grade : "TBD"}
                  </h4>
                  <p>Due Date: {formatDateToMDYY(assignment.dueDate)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
