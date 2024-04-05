//src/pages/Grades/Grades.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './grades.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Grades = () => {
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState({});
    const [assignmentName, setAssignmentName] = useState('');
    const [grade, setGrade] = useState('');
    const [students, setStudents] = useState({});
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('http://localhost:5050/assignments')
            .then(response => response.json())
            .then(data => {
                setGrades(data);
            })
            .catch(error => console.error('Error:', error));

            fetch('http://localhost:5050/courses')
            .then(response => response.json())
            .then(data => {
                // save courseData as object
                const coursesData = {};
                data.forEach(course => {
                    coursesData[course._id] = course.name;
                });
                setCourses(coursesData);
            })
            .catch(error => console.error('Error:', error));



            fetch('http://localhost:5050/students')
            .then(response => response.json())
            .then(data => {
                // save courseData as object
                const studentsData = {};
                data.forEach(student => {
                    studentsData[student._id] = student.firstName;
                });
                setStudents(studentsData);
            })
            .catch(error => console.error('Error:', error));

    }, []);



    const deleteGrade = async (id) => {
        const confirmation = window.confirm('Are you sure you want to delete this grade?');
        if (confirmation) {
            //Only works on the front end
            // const updatedGrades = grades.filter(grade => grade._id !== id);
            // setGrades(updatedGrades);
            // alert('Grade deleted successfully.');
            try{
                const response = await axios.delete(`http://localhost:5050/assignments/${id}`);
                if (response.status === 200) {
                    //Show lert if succeed
                    alert('Grade deleted successfully.');
                    window.location.href = '/grades'
                } else {
                   
                    alert('Failed to delete grade.');
                }
            }catch{
                    console.error('Error:');
                    alert('Failed to delete grade.');
            }
        }
        
    };

    //console.log('Grades',grades)

    return (
        <div className="grades-container">
            <h2>Grade Page </h2> {/**add User name once lgin */} 
            <ul>
                    {grades.map(grade => (
                        <li key={grade._id}>
                            <div>
                            <h3>Assignment Name: {grade.name}</h3> {/**Assignment Name */}
                            <h3>Grade: {grade.grade}</h3>
                            <p>Weight: {grade.weight}</p>
                            <p>Course: {courses[grade.course]}</p>
                            <p>Student Name: {students[grade.student]}</p>
                            <p><Link to={`/editgrade/${grade._id}`}>Edit</Link></p> 
                            <Button variant="danger" onClick={() => deleteGrade(grade._id)}>Delete Assignment</Button>
                         </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Grades;


