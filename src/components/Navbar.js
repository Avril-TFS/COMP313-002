// src/components/Navbar.js

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { useAuth, AuthProvider } from "../contexts/AuthContext";
import ProfileDisplay from "./ProfilePopUp/ProfileDisplay";
import "./Navbar.css";
import logoImage from "../images/back.jpg";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, userDetails } = useAuth(AuthProvider);
  const [showModal, setShowModal] = useState(false);

  let userInfo;
  if (userDetails) {
    try {
      userInfo = JSON.parse(userDetails);
      //console.log("User details:", userInfo);
    } catch (error) {
      console.error("Error parsing userDetails:", error);
    }
  }

  useEffect(() => {
    if (userDetails) {
      try {
        userInfo = JSON.parse(userDetails);
        //console.log("User details:", userInfo);
      } catch (error) {
        console.error("Error parsing userDetails:", error);
      }
    }
  }, [userDetails]);

  const handleOpenModal = (userInfo) => {
    if (userInfo) {
      console.log("User info:", userInfo);
      ProfileDisplay(userInfo);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <BootstrapNavbar
      expand="lg"
      bg="dark"
      variant="dark"
      className="mx-auto w-100 "
    >
      <Container fluid>
        <Link to="/" className="navbar-brand">
          {/* Navbar brand logo */}
          <img src={logoImage} alt="Logo" className="logo" />
          {/* Navbar brand text */}
          NaviGrade
        </Link>

        <BootstrapNavbar.Toggle aria-controls="navbarNav" />

        <BootstrapNavbar.Collapse id="navbarNav">
          <Nav className="ml-auto w-100" bsPrefix>
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className="nav-link"
                  bsPrefix
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/courses" className="nav-link">
                  Courses
                </Nav.Link>
                <Nav.Link as={Link} to="/assignments" className="nav-link">
                  Assignments
                </Nav.Link>
                <Nav.Link as={Link} to="/completed-assignments" className="nav-link">
                  Completed Assignments {/* Added Completed Assignments link */}
                </Nav.Link>
                <Nav.Link as={Link} to="/calendar" className="nav-link">
                  Calendar
                </Nav.Link>
                <Nav.Link as={Link} to="/mygrades" className="nav-link">
                  My Grades
                </Nav.Link>

                <Nav.Link as={Link} to="/logout" className="nav-link">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/authentication/signup"
                  className="nav-link"
                >
                  Sign Up
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/authentication/signin"
                  className="nav-link"
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
        <BootstrapNavbar.Text className="text-white">
          {userInfo && userInfo.firstName
            ? `Welcome, ${userInfo.firstName}`
            : " "}
        </BootstrapNavbar.Text>
        {user ? (
          <>
            <ProfileDisplay
              show={showModal}
              handleClose={handleCloseModal}
              user={userInfo}
            />
          </>
        ) : (
          console.log("No user")
        )}
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
