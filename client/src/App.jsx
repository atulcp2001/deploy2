import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import VerifiedPage from './components/pages/VerifiedPage';
import UserProfilePage from './components/pages/UserProfilePage';

const App = () => {
  return (
    <div className='h-full w-full text-center mx-auto py-10 font-bold bg-gray-900'>
        <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/reset-password" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verified" element={ <VerifiedPage /> }  />
        <Route path="/user-profile" element={ <UserProfilePage /> } />
      </Routes>
    </Router>
    </div>
    
  );
};

export default App;
