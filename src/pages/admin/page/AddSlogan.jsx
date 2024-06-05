import React, { useContext, useEffect, useState } from 'react';
import myContext from '../../../context/data/myContext';

function AddSlogan() {
    const context = useContext(myContext);
    const { slogan, setSlogan, category, setCategory, handleAddSlogan, slogans } = context;
    const [filteredSlogans, setFilteredSlogans] = useState([]);

    console.log(slogans)
    // Fetch slogans based on selected category
    useEffect(() => {
        if (category) {
            const filtered = slogans.filter(slogan => slogan.category === category);
            setFilteredSlogans(filtered);
        } else {
            setFilteredSlogans([]);
        }
    }, [category, slogans]);

    return (
        <div className='flex justify-center items-center min-h-screen py-10'>
            <div className='bg-gray-800 px-10 py-10 rounded-xl '>
                <div className='flex flex-col items-center'>
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Add Slogan</h1>
                    <input
                        type="text"
                        placeholder="Enter slogan"
                        className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'>
                        <option value="">Select Category</option>
                        <option value="Spiritual">Spiritual</option>
                        <option value="Bollywood">Bollywood</option>
                        <option value="Motivational">Motivational</option>
                    </select>
                    {/* Display slogans for the selected category */}
                    {filteredSlogans.length > 0 && (
                        <div className="text-white mb-4">
                            <h2 className="font-bold text-lg mb-2">Slogans for {category}</h2>
                            <ul>
                                {filteredSlogans.map((slogan, index) => (
                                    <li key={index}>{slogan.text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <button
                        onClick={handleAddSlogan}
                        className='bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg'>
                        Add Slogan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddSlogan;
