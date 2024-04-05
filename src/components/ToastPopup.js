import Toast from "react-bootstrap/Toast";
import { useState } from "react";

function ToastPopup({ text }) {
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(true);

  const toggleShowA = () => setShowA(!showA);
  const toggleShowB = () => setShowB(!showB);
  return (
    <Toast show={showA} onClose={toggleShowA}>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">NaviGrade</strong>
        <small>Notifcation</small>
      </Toast.Header>
      <Toast.Body>{text}</Toast.Body>
    </Toast>
  );
}

export default ToastPopup;
