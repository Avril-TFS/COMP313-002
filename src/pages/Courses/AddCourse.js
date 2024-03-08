import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { setDate } from 'date-fns';

function AddCourse() {
    const [name, setName] = useState('');
    const [professor, setProfessor] = useState('');
    const [schedule, setSchedule] = useState({ day: '', startTime: '', endTime: '' });
    //const [day,setDay] =useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [assignment, setAssignment] = useState('');
    const navigate = useNavigate();
    const { getAuthToken } = useAuth();
    axios.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken()}`;
    const apiKey = process.env.REACT_APP_API_KEY;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
       
        try {
            // Create a new schedule
            const data = {
                name:name,
                professor:professor,
                schedule:[
                    {day:schedule.day,
                    startTime:schedule.startTime,
                    endTime:schedule.endTime}],
                startDate:'',
                endDate:'',
                assignments:[]
            };
        
           
            const response = await axios.post(`${apiKey}/courses/`, data);

            if (response.status === 201) {
                navigate('/courses');
            } else {
                const errorMessage = response.data.message || 'Failed to add course';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add course');
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
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                        type="Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
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
                            onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                            
                        />
                        <Form.Control
                            type="text"
                            placeholder="End Time"
                            value={schedule.endTime}
                            onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
    
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

                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
}

export default AddCourse;
