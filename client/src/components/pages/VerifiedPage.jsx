import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const serverUrl = "https://deploy2be.onrender.com"; // for production deployment
// const serverUrl = "http://localhost:3000"; // for development

const VerifiedPage = () => {

    const navigate = useNavigate();

    useEffect(() => {
    // Redirect to the UserProfilePage after 10 seconds
    const redirectTimeout = setTimeout(() => {
      navigate('/user-profile');
    }, 10000);

    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${serverUrl}/protected`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          // User is authenticated, clear the redirect timeout and redirect to the profile page
          clearTimeout(redirectTimeout);
          navigate('/user-profile');
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


    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);
  
  return (
    <div className='text-white'>
      <h1 className='py-10 text-3xl font-oswald'>Account Verification Successful!</h1>
      <p className='py-2 text-xl text-orange-600 font-oswald font-light'>Your account has been successfully verified.</p>
      <p className='py-2 text-lg text-white font-oswald font-light'>
      Redirecting to your profile page in 10 seconds...
      Or click <Link to="/user-profile"><span className='text-lg text-orange-600 font-oswald font-light underline'>here</span>here</Link> to go to your profile page.</p>
    </div>
  );
};

export default VerifiedPage;
