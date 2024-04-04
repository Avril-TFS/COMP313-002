//src/pages/Grades/MyGrades.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";
import Footer from '../../components/Footer';
import "./grades.css"
import {Card} from "react-bootstrap";

const MyGrades = () => {
    const { getAuthToken, userDetails } = useAuth(); // Destructure userDetails from useAuth
    const [grades, setGrades] = useState([]);
    const [estimatedGrade, setEstimatedGrade] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const token = getAuthToken();
                const response = await axios.get('http://localhost:5050/assignments', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setGrades(response.data);
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, [getAuthToken]);

    useEffect(() => {
        const fetchEstimatedGrade = async () => {
            try {
                const token = getAuthToken();
                const userId = userDetails; // Use userDetails directly to get the user's ID
                const response = await axios.get(`http://localhost:5050/estimate-grade/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEstimatedGrade(response.data.estimatedGrade);
            } catch (error) {
                console.error('Error fetching estimated grade:', error);
            }
        };
    
        fetchEstimatedGrade();
    }, [getAuthToken, userDetails]); // Add userDetails to the dependency array

    return (
        <div>
            <h2>My Grades</h2>
            <p>Estimated Final Grade: {estimatedGrade}</p>
            <div className="assignments-container">
                {grades.map((grade) => (
                    <Card
                        key={grade._id}
                        className="assignment-card"
                        style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
                        bsPrefix
                    >
                        <Card.Header>{grade.name}</Card.Header>
                        <Card.Body>
                            <Card.Text>Grade: {grade.grade}</Card.Text>
                            <Card.Text>Weight: {grade.weight}</Card.Text>
                            
                            
                        </Card.Body>
                    </Card>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default MyGrades;
