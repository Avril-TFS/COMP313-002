import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { calculateStudentLevel } from "../pages/Assignments/Assignments";

  const AssignmentProgressbar=({assignments}) =>{
    const completedPercentage = Math.round(
      (assignments.filter((assignment) => assignment.completed).length /
        assignments.length) *
        100
    );
  
    return(
      <div>
      <ProgressBar
        now={completedPercentage}
        label={`${completedPercentage}%`}
      />
      <h5>
        Your Student Level: {calculateStudentLevel(completedPercentage)}
      </h5>
    </div>
    )
  };

  export default AssignmentProgressbar;
