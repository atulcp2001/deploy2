import React, { useState } from 'react'
import { Link } from 'react-router-dom';
const serverUrl = "https://deploy2be.onrender.com"; // for production deployment
// const serverUrl = "http://localhost:3000"; // for development

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setMessage('Please enter your name');
      return;
    }  

    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setPassword('');
      setConfirmPassword('');
      return;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!&*])[A-Za-z\d@#!&*]+$/;
    if (!passwordRegex.test(password)) {
      setMessage('Password must contain at least 1 uppercase letter, 1 number, and 1 special character (@, #, !, &, *)');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setPassword('');
      setConfirmPassword('');
      return;
    }
    
    try {
      // Make a POST request to the server to signup
      // console.log(`Sending signup data to server: name: ${name}, email: ${email}, password: ${password}`)
      // console.log(serverUrl);
      const response = await fetch(`${serverUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Signup successful
        alert('Signup successful!');
        setMessage('');
        // Reset the form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        // Signup failed
        const error = await response.json();
        alert(`Signup failed: ${error.message}`);
      }
    } catch (error) {
      // Error handling
      console.error('Error:', error);
    }
  };

  return (
    <div className='text-white'>
      <h2 className='py-10 text-3xl font-oswald uppercase'>Signup to get started</h2>
        <p className='py-2 text-xl text-orange-600 font-oswald font-light'>
        Already have an account? <Link to="/">Log in</Link>
        </p>
        <form onSubmit={handleSubmit}>
        <div className='py-2'>
          {/* <label className='px-2 font-oswald font-light text-lg'>Name:</label> */}
          <input
            type="text"
            placeholder='Enter your name here'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='px-2 font-oswald text-slate-800 font-light text-xl py-2 w-[300px] border-2 border-orange-300 rounded-sm'
          />
        </div>
        <div className='py-2'>
          {/* <label className='px-2 font-oswald font-light text-xl'>Email:</label> */}
          <input
            type="email"
            placeholder='Enter your email here'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='px-2 font-oswald text-slate-800 font-light text-lg py-2 w-[300px] border-2 border-orange-300 rounded-sm'
          />
        </div>
        <div className='py-2'>
          {/* <label className='px-2 font-oswald font-light text-xl'>Password:</label> */}
          <input
            type="password"
            placeholder='Enter your password here'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='px-2 font-oswald text-slate-800 font-light text-lg py-2 w-[300px] border-2 border-orange-300 rounded-sm'
          />
        </div>
        <div className='py-2'>
          <input
            type="password"
            placeholder='Confirm your password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='px-2 font-oswald text-slate-800 font-light text-lg py-2 w-[300px] border-2 border-orange-300 rounded-sm'
          />
        </div>
        <button
            className='mx-10 px-10 py-2 my-10
            text-white uppercase font-oswald font-light
            border-2 rounded-md
             bg-orange-600 '
        >Signup</button>
        </form>
        
        {message && <p className='font-oswald text-orange-600 font-light text-lg'>{message}</p>}
    </div>
  );
};

export default SignupPage;
