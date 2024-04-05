// //src/pages/Grades/MyGrades.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../contexts/AuthContext";

const MyGrades = () => {
    const { getAuthToken, userDetails } = useAuth();
    const [grades, setGrades] = useState([]);
    const [estimatedGrade, setEstimatedGrade] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const token = getAuthToken();
                const userId = userDetails; // Use userDetails directly to get the user's ID
                console.log('Fetching grades for user:', userId);
                console.log('Authorization token:', token);
                const response = await axios.get(`http://localhost:5050/assignments/student/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Response data:', response.data);
                setGrades(response.data);
            } catch (error) {
                console.error('Error fetching grades:', error);
                setError('Error fetching grades. Please try again later.');
            }
        };
    
        fetchGrades();
    }, [getAuthToken, userDetails]);
    
    useEffect(() => {
        const fetchEstimatedGrade = async () => {
            try {
                const token = getAuthToken();
                const response = await axios.get(`http://localhost:5050/estimate-grades`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEstimatedGrade(response.data);
                setIsLoading(false); // Set loading to false once estimated grade is fetched
            } catch (error) {
                setError('Error fetching estimated grade. Please try again later.');
                console.error('Error fetching estimated grade:', error);
            }
        };
    
        fetchEstimatedGrade();
    }, [getAuthToken]);

    return (
        <div>
            <h2>My Grades</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <p>{estimatedGrade && estimatedGrade.message}</p>
                    <p>Estimated Final Grade: {estimatedGrade && estimatedGrade.estimatedGrades}</p>
                    <ul>
                        {grades.map((grade) => (
                            <li key={grade._id}>
                                <p>Assignment Name: {grade.name}</p>
                                <p>Grade: {grade.grade}</p>
                                <p>Weight: {grade.weight}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default MyGrades;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from "../../contexts/AuthContext";

// const MyGrades = () => {
//     const { getAuthToken, userDetails, setUserDetails } = useAuth();
//     const [grades, setGrades] = useState([]);
//     const [estimatedGrade, setEstimatedGrade] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchGrades = async () => {
//             try {
//                 const token = getAuthToken();
//                 const userId = userDetails && userDetails.id; // Access user ID from userDetails
//                 if (!userId) {
//                     console.error('User ID not found in userDetails');
//                     return;
//                 }
//                 console.log('Fetching grades for user:', userId);
//                 console.log('Authorization token:', token);
//                 const response = await axios.get(`http://localhost:5050/assignments/student/${userId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 console.log('Response data:', response.data);
//                 setGrades(response.data);
//             } catch (error) {
//                 console.error('Error fetching grades:', error);
//                 setError('Error fetching grades. Please try again later.');
//             }
//         };
    
//         fetchGrades();
//     }, [getAuthToken, userDetails]);
    
//     useEffect(() => {
//         const fetchEstimatedGrade = async () => {
//             try {
//                 const token = getAuthToken();
//                 const response = await axios.get(`http://localhost:5050/estimate-grades`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setEstimatedGrade(response.data); // Set estimatedGrade to the response data
//                 setIsLoading(false); // Set loading to false once estimated grade is fetched
//             } catch (error) {
//                 setError('Error fetching estimated grade. Please try again later.');
//                 console.error('Error fetching estimated grade:', error);
//             }
//         };
    
//         fetchEstimatedGrade();
//     }, [getAuthToken]);

//     return (
//         <div>
//             <h2>My Grades</h2>
//             {isLoading ? (
//     <p>Loading...</p>
// ) : (
//     <>
//         {error && (
//             <p>{error && typeof error === 'object' ? JSON.stringify(error) : error}</p>
//         )}
//         {estimatedGrade && Object.keys(estimatedGrade).length === 0 ? (
//             <p>No estimated grade available</p>
//         ) : (
//             <>
//                 {estimatedGrade && estimatedGrade.message && <p>{estimatedGrade.message}</p>}
//                 {estimatedGrade && estimatedGrade.estimatedGrades && <p>Estimated Final Grade: {estimatedGrade.estimatedGrades}</p>}
//             </>
//         )}
//         <ul>
//             {grades.length > 0 ? (
//                 grades.map((grade) => (
//                     <li key={grade._id}>
//                         <p>Assignment Name: {grade.name}</p>
//                         <p>Grade: {grade.grade}</p>
//                         <p>Weight: {grade.weight}</p>
//                     </li>
//                 ))
//             ) : (
//                 <p>No grades available</p>
//             )}
//         </ul>
//     </>
// )}
//         </div>
//     );
// };

// export default MyGrades;