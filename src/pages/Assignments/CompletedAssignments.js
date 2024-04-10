//pages/CompletedAssignments.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import { Card, Button, Form } from "react-bootstrap";
import { formatDateToMDYY } from "../../utils/serviceWorkers";
import { ToastContainer, toast } from "react-toastify";

const CompletedAssignments = () => {
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [editingGrade, setEditingGrade] = useState(null);

  //sorting function
  const [sortBy, setSortBy] = useState("dueDate"); // Default sorting by dueDate
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  const userInfo = JSON.parse(userDetails);

  useEffect(() => {
    const fetchCompletedAssignments = async () => {
      try {
        //console.log("userInfo.id", userInfo.id);
        const apikey = process.env.REACT_APP_API_KEY;
        let response = await axios.get(
          `${apikey}/completed-assignments/${userInfo.id}`
        );
        if (!response.data.length) {
          console.log("No completed assignments found");
        }
        console.log("Completed Assignments fetched successfully:", response);
        setCompletedAssignments(response.data);
      } catch (error) {
        console.error("Error fetching completed assignments:", error);
      }
    };
    fetchCompletedAssignments();
  }, [userInfo.id]);

  const markAssignmentIncomplete = async (assignmentId) => {
    try {
      const apikey = process.env.REACT_APP_API_KEY;
      await axios.put(
        `${apikey}/completed-assignments/${assignmentId}/mark-incomplete`,
        {
          completed: false,
        }
      );
      window.location.reload();
      toast("Assignment marked as incomplete successfully");

      //console.log("Assignment marked as incomplete successfully");
      // Update the completedAssignments state to reflect the change
      setCompletedAssignments((prevAssignments) => {
        return prevAssignments.map((assignment) => {
          if (assignment._id === assignmentId) {
            return {
              ...assignment,
              completed: false,
            };
          }
          return assignment;
        });
      });
      window.location.reload();
    } catch (error) {
      console.error("Error marking assignment as incomplete:", error);
      toast("Failed to mark assignment as incomplete");
    }
  };

  const handleSortChange = (value) => {
    if (value === sortBy) {
      // If already sorted by this value, toggle sorting order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new value, set new sort value and default sorting order to ascending
      setSortBy(value);
      setSortOrder("asc");
    }
  };

  const sortedAssignments = [...completedAssignments].sort((a, b) => {
    if (sortBy === "dueDate") {
      // Sort by dueDate
      return sortOrder === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sortBy === "grade") {
      // Sort by priority (from high number to low number)
      return sortOrder === "asc" ? b.grade - a.grade : a.grade - b.grade;
    }
    return 0;
  });

  return (
    <div className="assignments-container">
      <ToastContainer />
      <Button variant="success" onClick={() => handleSortChange("dueDate")}>
        Sort by Due Date
      </Button>
      <Button variant="info" onClick={() => handleSortChange("grade")}>
        Sort by Grade
      </Button>
      {!sortedAssignments.length == 0 ? (
        sortedAssignments.map((assignment) => (
          <Card
            key={assignment._id}
            className="assignment-card"
            style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
            bsPrefix
          >
            <Card.Header>{assignment.name}</Card.Header>
            <Card.Body>
              <Card.Text>
                Due Date: {formatDateToMDYY(assignment.dueDate)}
              </Card.Text>
              <Card.Text>Grade: {assignment.grade}</Card.Text>

              <Button onClick={() => markAssignmentIncomplete(assignment._id)}>
                Mark as Incomplete
              </Button>

              <Button variant="info" href={`/editassignment/${assignment._id}`}>
                Edit
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <h3>No completed assignments found</h3>
      )}
    </div>
  );
};

export default CompletedAssignments;
