import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddCourse() {
  const [name, setName] = useState("");
  const [professor, setProfessor] = useState("");
  const [schedule, setSchedule] = useState({
    day: "",
    startTime: "",
    endTime: "",
  });
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const navigate = useNavigate();
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);

  const userInfo = JSON.parse(userDetails);
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new schedule
      const data = {
        name: name,
        professor: professor,
        schedule: [
          {
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          },
        ],
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        assignments: [],
        memo:memo
      };

      const response = await axios.post(`${apiKey}/courses/`, data);

      if (response.status === 201) {
        // Update the student's course list
        const courseId = response.data.courseId;
        const studentResponse = await axios.post(
          `${apiKey}/courses/${userInfo.id}/add-course`,
          { courseId }
        );
        if (studentResponse.status === 201) {
          navigate("/courses");
        }
      } else {
        const errorMessage = response.data.message || "Failed to add course";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add course");
    }
  };

  return (
    <div className="courses-container">
      <h2>Add Course</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Professor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Professor's Name"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Schedule</Form.Label>
          <Form.Control
            type="text"
            placeholder="Day"
            value={schedule.day}
            onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
          />
          <Form.Control
            type="text"
            placeholder="Start Time"
            value={schedule.startTime}
            onChange={(e) =>
              setSchedule({ ...schedule, startTime: e.target.value })
            }
          />
          <Form.Control
            type="text"
            placeholder="End Time"
            value={schedule.endTime}
            onChange={(e) =>
              setSchedule({ ...schedule, endTime: e.target.value })
            }
          />
        </Form.Group>

        {/* <Form.Group>
                    <Form.Label>Assignments</Form.Label>
                    <Form.Control
                        type="text"
                        value={assignment}
                        onChange={(e) => setSchedule(e.target.value)}
                        required
                    />
                </Form.Group> */}

        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <div></div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setstartDate(date)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <div></div>
          <DatePicker
            selected={endDate}
            onChange={(date) => setendDate(date)}
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

export default AddCourse;
