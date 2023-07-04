import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// const serverUrl = "http://localhost:3000"; // for development
const serverUrl = "https://deploy2be.onrender.com"; // for production deployment

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('resetToken');
    if (token) {
      setResetToken(token);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/login`, {
        method: 'POST',
        // mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        // Login successful
        alert('Login successful!');

      //   const data = await response.json();
      //   const { token } = data;

      // // Set the token in the localStorage
      // localStorage.setItem('jwttoken', token);

        // Redirect or perform any desired actions
        navigate('/user-profile');
      } else {
        // Login failed
        const error = await response.json();
        setErrorMessage(error.message);
      }
    } catch (error) {
      // Error handling
      console.error('Error:', error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!resetPasswordEmail) {
      setResetPasswordMessage('Please enter your email');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetPasswordEmail }),
      });

      if (response.ok) {
        // Forgot password email sent successfully
        setResetPasswordMessage('Password reset email sent. Please check your inbox.');
      } else {
        // Forgot password failed
        const error = await response.json();
        setResetPasswordMessage(error.message);
      }
    } catch (error) {
      // Error handling
      console.error('Error:', error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!newPassword) {
      setResetPasswordMessage('Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetPasswordMessage('Passwords do not match');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!&*])[A-Za-z\d@#!&*]+$/;
    if (!passwordRegex.test(newPassword)) {
      setResetPasswordMessage('Password must contain at least 1 uppercase letter, 1 number, and 1 special character (@, #, !, &, *)');
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/reset-password/${resetToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        // Password reset successful
        setResetPasswordSuccess(true);
      } else {
        // Password reset failed
        const error = await response.json();
        setResetPasswordMessage(error.message);
      }
    } catch (error) {
      // Error handling
      console.error('Error:', error);
    }
  };

  return (
    <div className='text-white'>
      {!resetToken && !showForgotPasswordForm && (
        <>
          <h2 className='py-10 text-3xl font-oswald uppercase'>Login Page</h2>
          {/* Add link to Signup Page */}
          <p className='py-2 text-xl text-orange-600 font-oswald font-light'>
            Don't have an account? <Link to='/signup'>Sign up</Link>
          </p>
          {errorMessage && <p className='py-2 text-xl text-orange-600 font-oswald font-light'>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className='py-2'>
              <input
                type="email"
                placeholder='Enter your email here'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='px-2 font-oswald text-slate-800 font-light text-xl py-2 w-[300px] border-2 border-orange-300 rounded-sm'
              />
            </div>
            <div className='py-2'>
              <input
                type="password"
                placeholder='Enter your password here'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='px-2 font-oswald text-slate-800 font-light text-xl py-2 w-[300px] border-2 border-orange-300 rounded-sm'
              />
            </div>
            <button
              type="submit"
              className='mx-10 px-10 py-2 my-10
                text-white uppercase font-oswald font-light
                border-2 rounded-md
                bg-orange-600 '
            >
              Login
            </button>
            <p className='py-2 text-xl text-orange-600 font-oswald font-light'>
              <button
                className='text-orange-600 underline hover:text-orange-800 focus:outline-none'
                onClick={() => setShowForgotPasswordForm(true)}
              >
                Forgot password? Click here
              </button>
            </p>
          </form>
        </>
      )}

      {!resetToken && showForgotPasswordForm && (
        <>
          <h2 className='py-10 text-3xl font-oswald uppercase'>Forgot Password</h2>
          {resetPasswordMessage && (
            <p className='py-2 text-xl text-orange-600 font-oswald font-light'>{resetPasswordMessage}</p>
          )}
          <form onSubmit={handleForgotPassword}>
            <div className='py-2'>
              <input
                type="email"
                placeholder='Enter your email here'
                value={resetPasswordEmail}
                onChange={(e) => setResetPasswordEmail(e.target.value)}
                className='px-2 font-oswald text-slate-800 font-light text-xl py-2 w-[300px] border-2 border-orange-300 rounded-sm'
              />
            </div>
            <button
              type="submit"
              className='mx-10 px-10 py-2 my-10
                text-white uppercase font-oswald font-light
                border-2 rounded-md
                bg-orange-600 '
            >
              Send Reset Password Email
            </button>
            <p className='py-2 text-xl text-orange-600 font-oswald font-light'>
              <button
                className='text-orange-600 underline hover:text-orange-800 focus:outline-none'
                onClick={() => setShowForgotPasswordForm(false)}
              >
                Back to Login
              </button>
            </p>
          </form>
        </>
      )}

      {resetToken && (
        <>
          <h2 className='py-10 text-3xl font-oswald uppercase'>Reset Password</h2>
          {resetPasswordSuccess ? (
            <>
              <p className='py-2 text-xl text-orange-600 font-oswald font-light'>
                Password has been reset successfully!
              </p>
              <p className='py-2 text-xl text-orange-600 font-oswald font-light'>
                <Link to='/user-profile'>Proceed to your profile</Link>
              </p>
            </>
          ) : (
            <>
              {resetPasswordMessage && (
                <p className='py-2 text-xl text-orange-600 font-oswald font-light'>{resetPasswordMessage}</p>
              )}
              <form onSubmit={handleResetPassword}>
                <div className='py-2'>
                  <input
                    type="password"
                    placeholder='Enter your new password here'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='px-2 font-oswald text-slate-800 font-light text-xl py-2 w-[300px] border-2 border-orange-300 rounded-sm'
                  />
                </div>
                <div className='py-2'>
                  <input
                    type="password"
                    placeholder='Confirm your new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='px-2 font-oswald text-slate-800 font-light text-xl py-2 w-[300px] border-2 border-orange-300 rounded-sm'
                  />
                </div>
                <button
                  type="submit"
                  className='mx-10 px-10 py-2 my-10
                    text-white uppercase font-oswald font-light
                    border-2 rounded-md
                    bg-orange-600 '
                >
                  Update Password
                </button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LoginPage;
