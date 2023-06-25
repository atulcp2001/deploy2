import React, { useState } from 'react'
import './index.css'
const serverUrl = 'http://localhost:3000'
import SignupPage from './components/pages/SignupPage'

const App = () => {

    return(
        <div className='h-full w-full text-center mx-auto py-10 font-bold bg-slate-900'>
            <SignupPage />
        </div>
        
    );

}

export default App