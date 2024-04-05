import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth,AuthProvider } from '../../contexts/AuthContext';

function EditGrade(props) {
    const { id } = useParams();
    let navigate = useNavigate();
    const [assignment, setAssignment] = useState({ id: '', name: '', dueDate: Date(), course: '', grade: 0, weight: 0 });
    const [courses, setCourses] = useState([]); 
    const { getAuthToken } = useAuth();
    axios.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken()}`;
    const apikey = process.env.REACT_APP_API_KEY;
    const apiUrl = `${apikey}/assignments/${id}`;

    const { user, userDetails } = useAuth(AuthProvider);
    const userInfo = JSON.parse(userDetails);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assignment
                const result = await axios.get(apiUrl);
                const { name, dueDate, course, weight,grade, priority, memo, completed } = result.data;
                
                setAssignment({ name, dueDate: new Date(dueDate), course, weight,grade , priority, memo, completed});

                // Course
                // const coursesResponse = await axios.get(`${apikey}/student/courses`);
                // setCourses(coursesResponse.data);
                // console.log('course: ',course);

                //course
                const response = await axios.get(
                `${apikey}/courses/student/${userInfo.id}`
                );
                setCourses(response.data);


            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [apiUrl, id]);



    const handleSave = (e) => {
        e.preventDefault();
        const data = {
            name: assignment.name,
            weight: assignment.weight,
            dueDate: assignment.dueDate.toISOString(),
            // courseId: course,
            course: assignment.course,
            grade: assignment.grade,
            priority: assignment.priority,
            memo: assignment.memo,
            completed: false
        };
        axios.patch(apiUrl, data)
            .then((result) => {
                navigate('/assignments');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="assignments-container">
            <h2>Edit Assignment</h2>
            <Form onSubmit={handleSave}>
                <Form.Group>
                    <Form.Label>Assignment Name </Form.Label>
                    <Form.Control
                        type="text"
                        value={assignment.name}
                        onChange={(e) => setAssignment({ ...assignment, name: e.target.value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Due Date </Form.Label>
                    <DatePicker
                        selected={assignment.dueDate}
                        onChange={(date) => setAssignment({ ...assignment, dueDate: date })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Course </Form.Label>
                    <Form.Control
                        as="select"
                        value={assignment.course}
                        onChange={(e) => setAssignment({ ...assignment, course: e.target.value })}
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                       
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Weight </Form.Label>
                    <Form.Control
                        type="number"
                        value={assignment.weight}
                        onChange={(e) => setAssignment({ ...assignment, weight: e.target.value })}
                        step="0.01"
                        min="0"
                        max="1"
                   />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Grade </Form.Label>
                    <Form.Control
                        type="number"
                        value={assignment.grade}
                        onChange={(e) => setAssignment({ ...assignment, grade: e.target.value })}
                        
                        max="100"
                      
                   />
                </Form.Group>


                <Form.Group>
                    <Form.Label>Priority </Form.Label>
                    <Form.Control
                        type="number"
                        value={assignment.priority}
                        onChange={(e) => setAssignment({ ...assignment, priority: e.target.value })}
                       
                        min="0"
                        max ="10"
                      
                   />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Memo </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={assignment.memo}
                        onChange={(e) => setAssignment({ ...assignment, memo: e.target.value })}
                       
                      
                   />
                </Form.Group>

                
                



                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div>
    );
}

export default EditGrade;
