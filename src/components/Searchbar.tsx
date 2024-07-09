"use client"
// import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react'


const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //const router = useRouter();


  return (
    <form 
      className="flex px-4 flex-wrap gap-4 mt-12" 
    
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product name or link"
        className="flex-1 min-w-[200px] w-full p-3 pl-5 border border-gray-300 rounded-3xl shadow-xs text-base text-gray-500 focus:outline-none"
      />

      <button 
        type="submit" 
        className="bg-[#5a259f]  rounded-3xl shadow-xs px-6 py-3 text-white text-base font-semibold hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar