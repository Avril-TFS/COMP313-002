// Home.js

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const Home = () => {
  const { user } = useAuth();
  return (
    <Container>
      <div>
        <h1 className="display-4">Welcome to NaviGrade</h1>
        <p className="lead">
          NaviGrade is your all-in-one solution for managing courses,
          assignments, and grades.
        </p>
        <hr className="my-4" />
        <p>Key Features:</p>
        <ul>
          <li>Track courses and their details.</li>
          <li>Add and manage assignments with due dates.</li>
          <li>Record grades for assignments and tests.</li>
          <li>Get estimates for final grades.</li>
          <li>Set reminders for assignment due dates.</li>
        </ul>
       
        <Row className="home-buttons-container justify-content-center">
        {!user && (
            <>
          <Col xs={12} md={6} className="text-md-center mb-1">
            <Button variant="dark" className="home-button">
              <Link to="/authentication/signup" className="nav-link">
                Sign Up
              </Link>
            </Button>
          </Col>
          <Col xs={12} md={6} className="text-md-center mb-1">
            <Button variant="dark" className="home-button">
              <Link to="/authentication/signin" className="nav-link">
                Log In
              </Link>
            </Button>
          </Col>
          </>
          )}
        </Row>
      </div>
    </Container>
  );
};

export default Home;
