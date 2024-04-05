const axios = require('axios');

async function testCompletedAssignmentsEndpoint() {
  try {
    const response = await axios.get('http://localhost:5050/completed-assignments');
    console.log('Response from completed assignments endpoint:', response.data);
  } catch (error) {
    console.error('Error fetching completed assignments:', error.message);
  }
}

testCompletedAssignmentsEndpoint();
