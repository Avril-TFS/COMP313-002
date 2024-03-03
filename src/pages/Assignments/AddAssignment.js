import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext";

function AddAssignment() {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [course, setCourse] = useState("");
  const [weight, setWeight] = useState("");
  const [student, setStudent] = useState("");
  const [grade, setGrade] = useState("");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState([]);
  const { getAuthToken } = useAuth();
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get data from form
      const data = {
        name: name,
        dueDate: dueDate.toISOString(),
        courseId: course,
        weight: weight,
        studentId: student,
      };

      // Get student's data
      const studentResponse = await axios.get(
        `http://localhost:5050/students/${student}`
      );
      console.log("student 98: ", { student });
      const studentData = studentResponse.data;

      // Update student's courses array with the new course
      const updatedStudentData = {
        ...studentData,
        courses: [...studentData.courses, course],
      };

      // Send POST request to add the course to student's courses
      await axios.post(`http://localhost:5050/courses/${student}/add-course`, {
        courseId: course,
      });

      // Update the student's data
      await axios.patch(
        `http://localhost:5050/students/${student}`,
        updatedStudentData
      );

      //Send POST request to add new assignment
      const response = await axios.post(
        `${apiKey}/assignments/add-assignment`,
        data
      );
      console.log("response: ", response);
      console.log("response status: ", response.status);
      // Redirect to assignments if succeed
      if (response.status === 201) {
        navigate("/assignments");
      } else {
        const errorMessage =
          response.data.message || "Failed to add assignment";
        alert(errorMessage);
      }

      //find corresponding courses by feching courses
      const courseResponse = await axios.get(`${apiKey}/courses/${course}`);
      const courseData = courseResponse.data;

      if (courseData) {
        const updatedCourseData = {
          ...courseData,
          assignments: [...courseData.assignments, response.data._id],
        };
        // コースを更新する
        await axios.patch(`${apiKey}/courses/${course}`, updatedCourseData);
      }

      navigate("/assignments");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add assignment");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${apiKey}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${apiKey}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchCourses();
    fetchStudents();
  });

  return (
    <div className="assignments-container">
      <h2>Add Assignment</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Due Date</Form.Label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Course</Form.Label>
          <Form.Control
            as="select"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            type="number"
            value={weight}
            placeholder="0.~1.0"
            step="0.01"
            min="0"
            max="1"
            onChange={(e) => setWeight(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Student</Form.Label>
          <Form.Control
            as="select"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            required
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Grade</Form.Label>
          <Form.Control
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </div>
  );
}

export default AddAssignment;
