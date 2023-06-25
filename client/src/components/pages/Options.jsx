import React, { useState } from 'react'
import './index.css'
const serverUrl = 'http://localhost:3000'

const Options = () => {
  
    const [name, setName] = useState('');
    const [options, setOptions] = useState([]);

const handleSubmit = async () => {
   try {
        const fetchData = await fetch(`${serverUrl}/options`);
        const data = await fetchData.json();
        setOptions(data);
        console.log(`Options: ${data}`)

    } catch (error) {
        console.error('Error:', error);
    }

    console.log('Submitted name:', name);
    
  };

  return (
    <div className='h-full w-full text-center mx-auto py-10 font-bold bg-slate-900'>
        <h2 className='text-6xl uppercase font-semibold text-white font-oswald'>Welcome to Your Next</h2>

        <div className='my-20 '>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='px-2 font-oswald font-light text-lg py-2'
        />
        
        <button onClick={handleSubmit}
        className='mx-10 px-10 py-2
         text-white uppercase font-oswald font-light
         border-2 rounded-md
          bg-orange-600 '>Find options</button>
      
        </div>
        {options.length >0 && (
            <div className='flex flex-col items-center text-white font-oswald font-extralight'>
                <p className='text-3xl'>Hello <span className='font-bold text-orange-600'>{name}!</span> Your options are:</p> 
                <br />
                <div className='text-left'>
                        {options.map((option, index) => {
                        return(
                            <p key={index} className='text-xl text-orange-400'>{option.id} - {option.desc}</p>
                        );
                        
                    })}
                </div>
            
            </div>
        )}
        
    </div>
  );
}

export default Options