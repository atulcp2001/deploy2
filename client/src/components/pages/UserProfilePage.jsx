import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const serverUrl = "https://deploy2be.onrender.com"; // for production deployment
// const serverUrl = "http://localhost:3000"; // for development


const UserProfilePage = () => {

    const navigate = useNavigate();
    const [pageMessage, setPageMessage] = useState('')

    // Add useEffect to check authentication status on page load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${serverUrl}/protected`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          // User is authenticated, continue rendering the component
          setPageMessage('Welcome to Your Profile!');
        } else {
          // User is not authenticated, redirect to the login page
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle the error, display a message, or perform any necessary action
      }
    };

    checkAuthentication();
  }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${serverUrl}/logout`, {
              method: 'GET',
              credentials: 'include', // Include credentials (cookies) in the request
            });
        
            if (response.ok) {
              // Logout successful
              // Additional client-side logic, if needed
              // Set the token in the localStorage
                // localStorage.removeItem('jwttoken');
              navigate('/'); // Redirect to the homepage or desired route within the React application
            } else {
              // Logout failed
              // Handle the error, display a message, or perform any necessary action
            }
          } catch (error) {
            // Error handling
            console.error('Error:', error);
            // Handle the error, display a message, or perform any necessary action
          }
      };

  return (
    <div className='text-white'>
      <h1 className='py-10 text-3xl font-oswald'>{pageMessage}</h1>
      <p className='py-2 text-xl text-orange-600 font-oswald font-light'>This is your user profile page.</p>
      <button 
      onClick={handleLogout}
      className='mx-10 px-10 py-2 my-10
      text-white uppercase font-oswald font-light
      border-2 rounded-md
      bg-orange-600 '
      >Logout</button>
    </div>
  );
};

export default UserProfilePage;
