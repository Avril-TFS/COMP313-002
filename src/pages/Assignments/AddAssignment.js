import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";

function AddAssignment() {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [course, setCourse] = useState("");
  const [weight, setWeight] = useState("");
  const [grade, setGrade] = useState("");
  const [courses, setCourses] = useState([]);
 //not sure if we should include completed field here
//  const [completed,setCompleted] = useState(false);
  const [memo, setMemo] = useState("");
  const [priority, setPriority] = useState(0);

  const navigate = useNavigate();
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);

  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
  const apiKey = process.env.REACT_APP_API_KEY;
  const token = getAuthToken();

  const userInfo = JSON.parse(userDetails);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get data from form
      const data = {
        name: name,
        dueDate: dueDate.toISOString(),
        courseId: course,
        weight: weight,
        studentId: userInfo.id,
        grade: grade,
        //completed:completed,
        memo:memo,
        priority:priority
      };

      // //Get student's data
      // const studentResponse = await axios.get(
      //   `${apiKey}/students/${studentId}`
      // );
      // console.log("student 98: ", { student });
      // const studentData = studentResponse.data;
      // //Update student's courses array with the new course
      // const updatedStudentData = {
      //   ...studentData,
      //   courses: [...studentData.courses, course],
      // };

      console.log("student", userInfo);

      // Send POST request to add the course to student's courses
      await axios
        .post(`${apiKey}/courses/${userInfo.id}/add-course`, {
          courseId: course,
        })
        .catch((error) => {
          console.error("Error adding course to student:", error.message);
        });

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
        const errorMessage = response.message || "Failed to add assignment";
        alert(errorMessage);
      }

      navigate("/assignments");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to add assignment");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${apiKey}/courses/student/${userInfo.id}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handlePriorityChange = (e) => {
    // Ensure input is within the range of 0 to 10
    const newValue = Math.max(0, Math.min(10, e.target.value));
    setPriority(newValue);
  };

  const handleGradeChange = (e) => {
    // Ensure input is within the range of 0 to 100
    const newValue = Math.max(0, Math.min(100, e.target.value));
    setGrade(newValue);
  };

  return (
    <div className="assignments-container">
      <h2>Add Assignment </h2>
      <p>User: {userInfo.firstName}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Due Date </Form.Label>
          <div></div>
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
          <Form.Control value={userInfo.firstName} required>
            {/* <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName}
              </option>
            ))}  */}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Grade</Form.Label>
          <Form.Control
            type="number"
            value={grade}
            onChange={handleGradeChange}
            min="0"
            max="100"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Priority</Form.Label>
          <Form.Control
            type="number"
            value={priority}
            // onChange={(e) => setPriority(e.target.value)}
            onChange={handlePriorityChange}
          min="0"
          max="10"
          />
        </Form.Group>


        <Form.Group>
          <Form.Label>Memo</Form.Label>
          <Form.Control
           as="textarea"
           placeholder="Memo Space"
           rows={5}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
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
