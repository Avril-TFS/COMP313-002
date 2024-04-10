import React, { useState } from "react";

const GradesFormEdit = ({ assignments }) => {
  const [editedAssignments, setEditedAssignments] = useState(assignments);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAssignments = [...editedAssignments];
    updatedAssignments[index][name] = value;
    setEditedAssignments(updatedAssignments);
  };

  return (
    <div>
      {editedAssignments.map((assignment, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            value={assignment.name}
            onChange={(e) => handleInputChange(e, index)}
          />
          <input
            type="text"
            name="grade"
            value={assignment.grade}
            onChange={(e) => handleInputChange(e, index)}
          />
          <input
            type="text"
            name="weight"
            value={assignment.weight}
            onChange={(e) => handleInputChange(e, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default GradesFormEdit;
