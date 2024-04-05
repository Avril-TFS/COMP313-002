import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./courses.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useAuth, AuthProvider } from "../../contexts/AuthContext";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { getAuthToken } = useAuth();
  const { user, userDetails } = useAuth(AuthProvider);

  const userInfo = JSON.parse(userDetails);
  axios.defaults.headers.common["Authorization"] = `Bearer ${getAuthToken()}`;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await axios.get(
        `${apiKey}/courses/student/${userInfo.id}`
      );
      const fetchedCourses = response.data;
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //Format Due Date
  const formatDateToMDYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2); //cut first 2 digits of the year 2024->24
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // add leading zero if minutes < 10
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const deleteCourse = async (id) => {
    //******************Only admin should be able to delete course?************
    //Otherwise, gives a conflict and make no sense when displaying assignments when course is not available
    // const confirmation = window.confirm('Are you sure you want to delete this grade?');
    // if (confirmation) {
    // try{
    //     const response = await axios.delete(`http://localhost:5050/courses/${id}`);
    //     if (response.status === 200) {
    //         //Show lert if succeed
    //         alert('Assignment deleted successfully.');
    //         window.location.href = '/courses'
    //     } else {
    //         alert('Failed to delete grade.');
    //     }
    // }catch{
    //         console.error('Error:');
    //         alert('Failed to delete grade.');
    // }
  };

  return (
    <div className="courses-container">
      <h2 className="display-5">Available Courses</h2>
      <Link to="/addcourse">
        <Button variant="primary">Add Course</Button>
      </Link>
      <div
        className="course-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {courses.map((course) => (
          <Card
            key={course._id}
            className="course-card"
            style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
            bsPrefix
          >
            <Card.Img variant="top" src={course.image} />{" "}
            {/* Add this line if you have images */}
            <Card.Body>
              <Card.Title>{course.name}</Card.Title>
              <Card.Text>Professor: {course.professor}</Card.Text>
              <Card.Text>
                {/* Schedule: {formatDateToMDYY(course.schedule)} */}
                <h5>Schedule: </h5>
                <ul>
                  {course.schedules[0] != null
                    ? course.schedules[0].day
                    : "TBD"}{" "}
                </ul>
                <ul>
                  Start:{" "}
                  {course.schedules[0] != null
                    ? course.schedules[0].startTime
                    : "TBD"}{" "}
                </ul>
                <ul>
                  End:{" "}
                  {course.schedules[0] != null
                    ? course.schedules[0].endTime
                    : "TBD"}{" "}
                </ul>
                {course.memo !== "" && (
                <p>Memo: {course.memo}</p>
                 )} 

                <p><Link to={`/editcourse/${course._id}`}>Edit</Link></p> 
              </Card.Text>

              {/* <Button variant="danger" onClick={() => deleteCourse(course._id)}>
                Delete this course
              </Button> */}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Courses;
