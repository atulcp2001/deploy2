import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const serverUrl = "https://deploy2be.onrender.com"; // for production deployment
// const serverUrl = "http://localhost:3000"; // for development

const VerifiedPage = () => {

    const navigate = useNavigate();
    const { verificationToken } = useParams();

    useEffect(() => {
      const verifyAccount = async () => {
        try {
          // Perform the account verification process here (e.g., API request to the server)
          const response = await fetch(`${serverUrl}/verify/${verificationToken}`, {
            method: 'GET',
            credentials: 'include',
          });
  
          if (response.ok) {
            // Verification succeeded
            setTimeout(() => {
              navigate('/user-profile');
            }, 10000);
          } else {
            // Verification failed
            navigate('/login');
          }
        } catch (error) {
          console.error('Error verifying account:', error);
          navigate('/login');
        }
      };
  
      verifyAccount();
    }, [navigate, verificationToken]);
  
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
