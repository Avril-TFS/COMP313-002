import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function EditCourse(props) {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        name: "",
        professor: "",
        schedules: [
            {
                day: "",
                startTime: "",
                endTime: ""
            }
        ],
        startDate: null,
        endDate: null,
        memo:""
    });

    const apiUrl = `http://localhost:5050/courses/${id}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(apiUrl);
                const { name, professor, schedules, startDate, endDate,memo } = result.data;
                setCourse({ name, professor, schedules, startDate, endDate,memo });
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [apiUrl, id]); 

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(apiUrl, course);
            navigate('/courses');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleScheduleChange = (index, field, value) => {
        const updatedSchedules = [...course.schedules];
        updatedSchedules[index][field] = value;
        setCourse(prevCourse => ({
            ...prevCourse,
            schedules: updatedSchedules
        }));
    };

    return (
        <div className="course-container">
            <h2>Edit Course</h2>
            <Form onSubmit={handleSave}>
                <Form.Group>
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={course.name}
                        onChange={(e) => setCourse({ ...course, name: e.target.value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Professor</Form.Label>
                    <Form.Control
                        type="text"
                        name="professor"
                        value={course.professor}
                        onChange={(e) => setCourse({ ...course, professor: e.target.value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Schedule</Form.Label>
                    {course.schedules.map((schedule, index) => (
                        <div key={index}>
                            <Form.Control
                                type="text"
                                name="day"
                                placeholder="Day"
                                value={schedule.day}
                                onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                            />
                            <Form.Control
                                type="text"
                                name="startTime"
                                placeholder="Start Time"
                                value={schedule.startTime}
                                onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                            />
                            <Form.Control
                                type="text"
                                name="endTime"
                                placeholder="End Time"
                                value={schedule.endTime}
                                onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                            />
                        </div>
                    ))}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                        selected={new Date(course.startDate)}
                        onChange={(date) => setCourse({ ...course, startDate: date })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                        selected={new Date(course.endDate)}
                        onChange={(date) => setCourse({ ...course, endDate: date })}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Memo </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={course.memo}
                        onChange={(e) => setCourse({ ...course, memo: e.target.value })}
                   />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
}

export default EditCourse;
