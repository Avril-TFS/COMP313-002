// components/AssignmentItem.js
import React from "react";
import { Card } from "react-bootstrap";
// import axios from 'axios';

const AssignmentItem = ({ assignment, studentId }) => {
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`;
  };

  return (
    <div>
      <p>Assignment Name: {assignment.name}</p>
      <p>Due Date: {formatDateToMDYY(assignment.dueDate)}</p>
      {/* Add more details as needed */}
       {/* if there's memo, display memo value */}
      {assignment.memo !== "" && (
        <p>Memo: {assignment.memo}</p>
      )}
       {/* if priority is not 0 (0 is default), display priority value */}
      {assignment.priority !== 0 && (
        <p>Priority: {assignment.priority}</p>
      )}
    </div>
  );
};

export default AssignmentItem;
