import React, { useState } from 'react'
const serverUrl = process.env.REACT_APP_SERVER_URL;

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the server to signup
      console.log(`Sending signup data to server: name: ${name}, email: ${email}, password: ${password}`)
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
        setMessage(data.message);
        // Reset the form
        setName('');
        setEmail('');
        setPassword('');
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
        <div className='py-2'>
          {/* <label className='px-2 font-oswald font-light text-lg'>Name:</label> */}
          <input
            type="text"
            placeholder='Enter your name here'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='px-2 font-oswald text-slate-800 font-light text-xl py-2 w-[300px]'
          />
        </div>
        <div className='py-2'>
          {/* <label className='px-2 font-oswald font-light text-xl'>Email:</label> */}
          <input
            type="email"
            placeholder='Enter your email here'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='px-2 font-oswald text-slate-800 font-light text-lg py-2 w-[300px]'
          />
        </div>
        <div className='py-2'>
          {/* <label className='px-2 font-oswald font-light text-xl'>Password:</label> */}
          <input
            type="password"
            placeholder='Enter your password here'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='px-2 font-oswald text-slate-800 font-light text-lg py-2 w-[300px]'
          />
        </div>
        <button onClick={handleSubmit}
            className='mx-10 px-10 py-2 my-10
            text-white uppercase font-oswald font-light
            border-2 rounded-md
             bg-orange-600 '
        >Signup</button>
        {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;
