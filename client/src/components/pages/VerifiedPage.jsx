import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifiedPage = () => {
  const navigate = useNavigate();

  // Redirect to the UserProfilePage
  const redirectToProfile = () => {
    navigate('/user-profile');
  };

  useEffect(() => {
    // Delay the redirect for 10 seconds
    const redirectTimeout = setTimeout(redirectToProfile, 10000);

    return () => {
      // Clean up the timeout if the component unmounts before the timeout completes
      clearTimeout(redirectTimeout);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className='text-white'>
      <h1 className='py-10 text-3xl font-oswald'>Account Verification Successful!</h1>
      <p className='py-2 text-xl text-orange-600 font-oswald font-light'>Your account has been successfully verified.</p>
      <p className='py-2 text-lg text-white font-oswald font-light'>
        Redirecting to your profile page in 10 seconds...
        Or click <span className='text-lg text-orange-600 font-oswald font-light underline' onClick={redirectToProfile}>here</span> to go to your profile page.
      </p>
    </div>
  );
};

export default VerifiedPage;
