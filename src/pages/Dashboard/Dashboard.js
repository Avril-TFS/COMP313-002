// Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import "./Dashboard.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentItem from "../../components/AssignmentItem";
import AssignmentProgressbar from "../../components/AssignmentProgressbar";
import Calendar from "../Calendar/Calendar";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);  //assignments are sorted by completed
  const [courses, setCourses] = useState([]);
  const [totalAssignments, setTotalAssignments] = useState([]); //totalAssignments are total assignment without sorting 
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);
  const userInfo = JSON.parse(userDetails);
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchAssignments();
  }, []);

 // console.log('userinfo',userInfo.email);

  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year} `;
  };

  const fetchAssignments = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/assignments/student/${userInfo.id}`
      );
      const fetchedAssignments = response.data;
      setTotalAssignments(fetchedAssignments);
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
      const sortedAssignments = [...updatedAssignments].sort((a, b) => {
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      setAssignments(sortedAssignments);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const notifyClosestAssignment = () => {
    if (assignments.length === 0) {
      toast("No assignments currently.");
      return;
    }
  
    // Sort assignments by dueDate in ascending order
    const sortedAssignments = [...assignments].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  
    // Get the closest assignment (first one in the sorted list)
    const closestAssignment = sortedAssignments[0];
  
    const today = new Date();
    const dueDate = new Date(closestAssignment.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Display a toast with information about the closest assignment
    toast(`Closest assignment: ${closestAssignment.name}  
    ${diffDays} day(s) left`);
  };

  const notifyEmailSentMessage = () =>{
    toast("Email sent");
  }
//email notification 
const handleSendEmail = async () => {
 
  try {
    const sortedAssignments = [...assignments].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    if(sortedAssignments.length == 0){
      toast("You do not have any assignment");
    }
    const closestAssignment = sortedAssignments[0];
    const today = new Date();
    const dueDate = new Date(closestAssignment.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const userEmail = userInfo.email;
    const apiKey = process.env.REACT_APP_API_KEY;
    const response = await axios.post( `${apiKey}/email/sendEmail`,{
    closestAssignment: closestAssignment,
    diffDays: diffDays,
    userEmail: userEmail
    });
    console.log('dueDate' ,dueDate)
    console.log("Email sent")
    // pop up message
    notifyEmailSentMessage();
  } catch (error) {
    console.error("Error sending email:", error);
   
  }
};

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

  return (
    <div className="dashboard-container mx-auto">
    
     
    <div id="cssportal-grid">
      <div id="div1">
            {/* top center row */}
      <h3 className="display-5"> Dashboard for {userInfo.firstName} </h3>
    
      <AssignmentProgressbar
      assignments={ totalAssignments}
      />
          <div className="button-container" >
              <Button variant="warning" onClick={notifyClosestAssignment}>
                What is due next?
              </Button>
              <ToastContainer />
              <Button variant="info" onClick={handleSendEmail}>Send me a reminder Email</Button>
        </div>
        
      </div>
      <div id="div2" className="text-center">
        {/* left column */}
              
      <h4>Assignment(s)</h4>
      {assignments.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="assignment-card"
              style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
              bsPrefix
            >
              <AssignmentItem
                assignment={assignment}
                studentId={userInfo.id}
              />
            </Card>
          ))}
        </div>
      )}
      </div>
      <div id="div3" className="text-center"> 
       <h4>Assignment Calendar</h4>
      
       <Calendar courses={courses} assignments={totalAssignments} />
      </div>
  </div>

      {/* 
      <AssignmentProgressbar
      assignments={ totalAssignments}
      />
      <Button variant="warning" onClick={notifyClosestAssignment}>
        What should I do!?
      </Button>
      <ToastContainer />
      <button onClick={handleSendEmail}>Send Email</button>
      <h4>Assignment(s)</h4>
      {assignments.length === 0 ? (
        <p>No assignments currently.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="assignment-card"
              style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
              bsPrefix
            >
              <AssignmentItem
                assignment={assignment}
                studentId={userInfo.id}
              />
            </Card>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
