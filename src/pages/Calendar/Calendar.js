//Calendar.js
import React, {useState} from 'react';
import { 
  Calendar as BigCalendar,
  dateFnsLocalizer,
  CalendarProps
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import DatePicker from 'react-datepicker';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

//css files
import 'react-big-calendar/lib/css/react-big-calendar.css';
require('./Calendar.css')


const locales = {
  'en-CA': require('date-fns/locale/en-CA'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
}); 

const getDayOfWeek = day => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days.indexOf(day.toLowerCase());
};

const MyCalendar = ({ courses , assignments}) => {
  // Map course schedules to events
  //console.log('Courses:', courses);

  //event handler for clicking events 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleEventClick = event => {
    // Set the selected event when an event item is clicked
    setSelectedEvent(event);
  };
  const handleCloseModal = event => {
    setSelectedEvent(null);
  };

  let events = [];
  
    events = courses.flatMap(course => {
      const courseEvents = [];

    // For each schedule in the course, generate events based on the course start and end dates
    course.schedules.forEach(schedule => {
      const startDate = new Date(course.startDate);
      const endDate = new Date(course.endDate);

      // Find the next occurrence of the scheduled day
      let currentDate = startDate;
      while (currentDate <= endDate) {
        const scheduleDay = new Date(currentDate);
        scheduleDay.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, and milliseconds

        const dayOfWeek = scheduleDay.getDay();
        if (dayOfWeek === getDayOfWeek(schedule.day)) {
          const startTimeParts = schedule.startTime.split(':').map(part => parseInt(part, 10));
          const endTimeParts = schedule.endTime.split(':').map(part => parseInt(part, 10));

          const startDateTime = new Date(scheduleDay);
          startDateTime.setHours(startTimeParts[0], startTimeParts[1]);

          const endDateTime = new Date(scheduleDay);
          endDateTime.setHours(endTimeParts[0], endTimeParts[1]);

          courseEvents.push({
            id: `${course._id}_${startDateTime.getTime()}`,
            title: course.name,
            start: startDateTime,
            end: endDateTime,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    });

    return courseEvents;
  });

  //console.log('Assignments:', assignments.dueDate);
  // Add events for assignments
  if (assignments) {
    events = events.concat(
      assignments.map((assignment) => ({
        id: assignment._id,
        title: assignment.name,
        start: assignment.dueDate,
        end: assignment.dueDate,
        allDay: true, // Show as all-day event
      }))
    );
  }


  return (
    <div style={{height: "600px"}}>
    <BigCalendar 
      defaultView='month' 
      localizer={localizer} 
      events={events} 
      startAccessor={(event) => new Date(event.start)} 
      endAccessor={(event) => new Date(event.end)} 
      locales={locales}
      onSelectEvent={handleEventClick} // Handle click event on event items
      />
      {selectedEvent && (
        <Modal show={true} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedEvent.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Start: {selectedEvent.start.toString()}</p>
            <p>End: {selectedEvent.end.toString()}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default MyCalendar;