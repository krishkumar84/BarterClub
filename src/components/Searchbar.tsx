"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';


const Searchbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [searchPrompt, setSearchPrompt] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
    setSearchPrompt(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchPrompt) return;

    setIsLoading(true);

    // Redirect to the products page with the search query as a parameter
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'query',
      value: searchPrompt,
    });

    router.push(`/products${newUrl}`, { scroll: false });
    setIsLoading(false);
  };

   
  return (
    <form 
      className="flex px-4 flex-wrap gap-4 mt-12" 
      onSubmit={handleSearch}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Search Products"
        className="flex-1 min-w-[200px] w-full p-3 pl-5 border border-gray-800 rounded-3xl shadow-xs text-slate-300 bg-neutral-900 focus:outline-none"
      />
      

      <button 
        type="submit" 
        style={{
          background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)'
        }}
        className=" rounded-3xl shadow-xs px-6 py-3 text-white text-base font-semibold hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar