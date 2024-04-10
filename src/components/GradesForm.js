import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import { Card, Form, Button, ButtonGroup, Row, Col } from "react-bootstrap";

import { toast, ToastContainer } from "react-toastify";

const GradesForm = ({
  handleChildData,
  completedassignments = [{ name: "", weight: "", grade: "" }],
}) => {
  const [assignments, setAssignments] = useState(completedassignments);
  const [validated, setValidated] = useState(false);
  const [Tests, setTests] = useState([{ name: "", weight: "", grade: "" }]);
  const [allTasks, setAllTasks] = useState([]);
  const [GradePrediction, setGradePrediction] = useState(null);

  if (assignments.length === 0) {
    console.log("No assignments");
    toast.error("No assignments found");
  }
  //console.log("Assignments:", assignments);

  const handleNameChange = (event, index) => {
    const newAssignments = [...assignments];
    newAssignments[index].name = event.target.value;
    setAssignments(newAssignments);
  };

  const handleWeightChange = (event, index) => {
    const newAssignments = [...assignments];
    newAssignments[index].weight = event.target.value;
    setAssignments(newAssignments);
  };

  const handleGradeChange = (event, index) => {
    const newAssignments = [...assignments];
    newAssignments[index].grade = event.target.value;
    setAssignments(newAssignments);
  };

  const handleTestNameChange = (event, index) => {
    const newTests = [...Tests];
    newTests[index].name = event.target.value;
    setTests(newTests);
  };

  const handleTestWeightChange = (event, index) => {
    const newTests = [...Tests];
    newTests[index].weight = event.target.value;
    setTests(newTests);
  };

  const handleTestGradeChange = (event, index) => {
    const newTests = [...Tests];
    newTests[index].grade = event.target.value;
    setTests(newTests);
  };
  const handleAddRow = () => {
    const newTests = [...Tests, { name: "", weight: "", grade: "" }];
    setTests(newTests);
  };

  const handleDeleteRow = () => {
    const newTests = [...Tests];
    newTests.pop();
    setTests(newTests);
  };

  const checkWeights = () => {
    let totalWeight = 0;
    assignments.forEach((assignment) => {
      if (assignment.weight !== "") {
        totalWeight += parseFloat(assignment.weight);
      }
    });
    Tests.forEach((test) => {
      if (test.weight !== "") {
        totalWeight += parseFloat(test.weight);
      }
    });
    if (totalWeight !== 1) {
      //console.log("Weights do not add up to 1.0");
      toast.error("Weights do not add up to 1.0 Current Total:" + totalWeight);
      setValidated(false);
      return false;
    }
    return true;
  };

  const calculateFinalGrade = () => {
    // Calculate the final grade based on weights and grades
    let totalWeight = 0;
    let weightedSum = 0;

    allTasks.forEach((assignment) => {
      totalWeight += assignment.weight;
      weightedSum += assignment.grade * assignment.weight;
    });

    //console.log("Final Grade:", weightedSum);
    setGradePrediction(weightedSum);
    //console.log("Final Grade:", GradePrediction);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      toast.error("Please fill out all fields");
      return;
    }
    setValidated(true);
    if (!checkWeights()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    const combinedData = [...assignments, ...Tests];
    setAllTasks(combinedData);
    //console.log("Combined data:", allTasks);

    //handleChildData(allTasks);
    calculateFinalGrade();
  };

  return (
    <>
      <ToastContainer />
      {GradePrediction ? (
        <Card className="assignment-card" bsPrefix>
          <Card.Title> Final Grade Prediction</Card.Title>
          <p>Your estimated grade is: {GradePrediction}</p>
        </Card>
      ) : (
        <>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col>
                {assignments.map((assignment, index) => (
                  <Card
                    className="assignment-card"
                    style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
                    bsPrefix
                  >
                    <Form.Group controlId="validationCustom01">
                      <Form.Label>
                        Assignment Name:
                        <Form.Control
                          required
                          type="text"
                          value={assignment.name}
                          onChange={(event) => handleNameChange(event, index)}
                        />
                      </Form.Label>
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="validationCustom02">
                      <Form.Label>
                        Assignment Weight:
                        <Form.Control
                          required
                          type="text"
                          value={assignment.weight}
                          onChange={(event) => handleWeightChange(event, index)}
                        />
                      </Form.Label>
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom03">
                      <Form.Label>
                        Assignment Grade:
                        <Form.Control
                          required
                          type="text"
                          value={assignment.grade}
                          onChange={(event) => handleGradeChange(event, index)}
                        />
                      </Form.Label>
                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                  </Card>
                ))}
              </Col>
              <Col>
                {Tests.map((test, index) => (
                  <Card
                    className="assignment-card"
                    style={{ flex: "0 0 calc(33% - 1em)", margin: "0.5em" }}
                    bsPrefix
                  >
                    <Form.Group controlId="validationCustom04">
                      <Form.Label>
                        Assignment Name:
                        <Form.Control
                          required
                          type="text"
                          value={test.name}
                          onChange={(event) =>
                            handleTestNameChange(event, index)
                          }
                        />
                        <Form.Control.Feedback>
                          Looks good!
                        </Form.Control.Feedback>
                      </Form.Label>
                    </Form.Group>
                    <Form.Group controlId="validationCustom05">
                      <Form.Label>
                        Assignment Weight:
                        <Form.Control
                          required
                          type="text"
                          value={test.weight}
                          onChange={(event) =>
                            handleTestWeightChange(event, index)
                          }
                        />
                        <Form.Control.Feedback>
                          Looks good!
                        </Form.Control.Feedback>
                      </Form.Label>
                    </Form.Group>
                    <Form.Group controlId="validationCustom06">
                      <Form.Label>
                        Assignment Grade:
                        <Form.Control
                          required
                          type="text"
                          value={test.grade}
                          onChange={(event) =>
                            handleTestGradeChange(event, index)
                          }
                        />
                      </Form.Label>

                      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                  </Card>
                ))}
                <ButtonGroup>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleAddRow}
                  >
                    Add Assignment/Test
                  </Button>

                  <Button
                    variant="success"
                    type="submit"
                    //onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    onClick={handleDeleteRow}
                  >
                    Delete Last Row
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>

            <br />
          </Form>
        </>
      )}
    </>
  );
};

export default GradesForm;
