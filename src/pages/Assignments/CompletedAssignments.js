//pages/CompletedAssignments.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import { Card, Button } from "react-bootstrap";
import { formatDateToMDYY } from "../../utils/serviceWorkers";

const CompletedAssignments = () => {
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);
  const [completedAssignments, setCompletedAssignments] = useState([]);
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

      console.log("Assignment marked as incomplete successfully");
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
    }
  };

  return (
    <>
      <div className="assignments-container">
        {!completedAssignments.length == 0 ? (
          completedAssignments.map((assignment) => (
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
                <Button
                  onClick={() => markAssignmentIncomplete(assignment._id)}
                >
                  Mark as Incomplete
                </Button>
              </Card.Body>
              {/* Display any other details of the completed assignment */}
            </Card>
          ))
        ) : (
          <h3>No completed assignments found</h3>
        )}
      </div>
    </>
  );
};

export default CompletedAssignments;
