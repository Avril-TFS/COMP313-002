//src/pages/Grades/EditGrade.js
import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function EditGrade(props) {
    const { id } = useParams(); 
    let navigate = useNavigate();
    const [grade, setGrade] = useState({ id: '', name: '', grade: 0, weight: 0 });
    const [assignmentName, setAssignmentName] = useState('');
    const apiUrl = `http://localhost:5050/assignments/${id}`;
  

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(apiUrl);
                const { name, grade, weight } = result.data;
                setAssignmentName(name);
                setGrade({ id, name, grade, weight });
            } catch (error) {
                console.error('Error:', error);
            }
        };
       
        fetchData();
    }, [apiUrl, id]); 

    const handleSave = (e) => {
        e.preventDefault();
        const data = { name: grade.name, grade: grade.grade, weight: grade.weight };
        axios.patch(apiUrl, data)
            .then((result) => {
                navigate('/grades');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="grades-container">
            <h2>Edit Grade</h2>
            <Form onSubmit={handleSave}>
                {/* <Form.Group>
                    <Form.Label>Assignment Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={assignmentName}
                        readOnly
                    />
                </Form.Group> */}
                <p>Assignment Name: {assignmentName}</p>
                <Form.Group>
                    <Form.Label>Grade  </Form.Label>
                    <Form.Control
                        type="number"
                        value={grade.grade}
                        onChange={(e) => setGrade({ ...grade, grade: e.target.value })}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Weight  </Form.Label>
                    <Form.Control
                        type="number"
                        value={grade.weight}
                        onChange={(e) => setGrade({ ...grade, weight: e.target.value })}
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