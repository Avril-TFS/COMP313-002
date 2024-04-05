import React from "react";
import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home/Home";
import CalendarContainer from "./pages/Calendar/CalendarContainer";
import Courses from "./pages/Courses/Courses";
import Assignments from "./pages/Assignments/Assignments";
import Navbar from "./components/Navbar";
import AuthenticationPage from "./components/AuthenticationPage";
import Login from "./pages/Login/Login";
import { useAuth } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import MyGrades from "./pages/Grades/MyGrades";
import Grades from "./pages/Grades/Grades";
import EditGrade from "./pages/Grades/EditGrade";
import EditCourse from "./pages/Courses/EditCourse";
import EditAssignment from "./pages/Assignments/EditAssignment";
import AddAssignment from "./pages/Assignments/AddAssignment";
import ViewCourse from "./pages/Courses/ViewCourse";
import AddCourse from "./pages/Courses/AddCourse";
import Dashboard from "./pages/Dashboard/Dashboard";
import Logout from "./components/Logout";
import CompletedAssignments from "./pages/Assignments/CompletedAssignments";
import "./styles.css";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Container>
        <Routes>
          {user ? (
            <>
              <Route path="/courses" element={<Courses />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/login" element={<Login />} />

              <Route path="/mygrades" element={<MyGrades />} />
              <Route path="/grades" element={<Grades />} />

              <Route
                path="/calendar"
                element={
                  <>
                    <CalendarContainer />
                    <div
                      style={{ width: "100%", height: "600px", margin: "50px" }}
                    />
                  </>
                }
              />
              <Route path="/editgrade/:id" element={<EditGrade />} />
              <Route path="/editcourse/:id" element={<EditCourse />} />
              <Route path="/editassignment/:id" element={<EditAssignment />} />
              <Route path="/addassignment" element={<AddAssignment />} />
              <Route path="/viewcourse/:id" element={<ViewCourse />} />
              <Route path="/addcourse" element={<AddCourse />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/completed-assignments" element={<CompletedAssignments />} />
 
            </>
          ) : (
            <Route path="authentication/*" element={<AuthenticationPage />} />
          )}

          {/* Make Home the default page */}
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />

          {user && (
            <>
              {/* ... (other routes for authenticated users) */}
              <Route path="/calendar" element={<CalendarContainer />} />
              <Route path="/editgrade/:id" element={<EditGrade />} />
              <Route path="/editcourse/:id" element={<EditCourse />} />
              <Route path="/editassignment/:id" element={<EditAssignment />} />
              <Route path="/addassignment" element={<AddAssignment />} />
              <Route path="/viewcourse/:id" element={<ViewCourse />} />
              <Route path="/addcourse" element={<AddCourse />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/completed-assignments" element={<CompletedAssignments />} />
            </>
          )}
        </Routes>
      </Container>
    </>
  );
}

export default App;
