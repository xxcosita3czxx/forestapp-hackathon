    import { useState, useEffect } from 'react';
    import './chatHistory.css';
    const App = () => {
    const [users, setUsers] = useState([]); // List of users
    const [loading, setLoading] = useState(true); // Loading state for users
    const [error, setError] = useState(null); // To capture and display errors

    useEffect(() => {
        // Fetch users from the /users/fetchall API endpoint using GET request
        const fetchUsers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/fetchall', {
            method: 'GET',
            headers: {
                  'Accept': 'application/json', // Ensure that the response is in JSON format
            },
            });

            // Check if response is successful
            if (response.ok) {
            const textData = await response.text(); // Get the response as raw text
            console.log('Response Body (Text):', textData); // Log the raw text response

            const data = JSON.parse(textData); // Manually parse the response text to JSON

            // Convert the object to an array of user objects
            const usersArray = Object.values(data).map(user => ({
                id: user.general.name, // Assuming name is unique for each user
                username: user.general.name, // or you could use another field if needed
            }));

            setUsers(usersArray); // Set the users data in state
            } else {
            setError(`Failed to fetch users. Status: ${response.status}`);
            }

            setLoading(false); // Stop loading once data is received
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error fetching users. Please try again later.');
            setLoading(false); // Stop loading if error occurs
        }
        };

        fetchUsers(); // Call the fetchUsers function when the component mounts
    }, []); // Empty dependency array ensures this runs only once

    const handleUserClick = (username) => {
        console.log(`${username} - Clicked`); // Log the username when user clicks the button
    };

    return (
        <div>
        {loading ? (
          <p className="loading-text">Loading users...</p> // Apply loading-text class
        ) : error ? (
          <p className="error-message">{error}</p> // Apply error-message class
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserClick(user.username)}
              className="user-button" // Apply user-button class
            >
              {user.username}
            </button>
          ))
        )}
        </div>
        );
    };

    export default App;
