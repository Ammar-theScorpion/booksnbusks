const SearchInput = ({ value, setValue }) => {
    return (


        //yacoob  inhance seacrh input desingn

        <div className="relative h-full w-96 bg-gray-100 rounded-lg shadow-md  ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 h-full">
                <svg className="w-4 h-full text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input type="search" id="search-dropdown" value={value} onChange={(e) => !!setValue && setValue(e.target.value)} className="block w-full py-2 h-full pl-10 pr-4 text-sm text-gray-900 border  rounded-lg bg-white focus:outline-none focus:ring-2  focus:ring-primary-800 focus:border-primary-800" placeholder="Search Mockups, Logos..." required />
        </div>



        // <div className="relative w-full max-w-sm">
        //     <div
        //         className="absolute top-0 left-0 p-2.5 text-sm font-medium h-full text-white bg-primary-primary border border-primary-50"
        //     >
        //         <svg
        //             className="w-4 h-4"
        //             aria-hidden="true"
        //             xmlns="http://www.w3.org/2000/svg"
        //             fill="none"
        //             viewBox="0 0 20 20"
        //         >
        //             <path
        //                 stroke="currentColor"
        //                 strokeLinecap="round"
        //                 strokeLinejoin="round"
        //                 strokeWidth="2"
        //                 d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        //             />
        //         </svg>
        //         <span className="sr-only">Search</span>
        //     </div>
        //     <input
        //         type="search"
        //         id="search-dropdown"
        //         className="block p-2.5 pl-10 w-full text-gray-900 bg-gray-50 border border-pink-700  text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-primary-800"
        //         placeholder="Search..."
        //         value={value}
        //         onChange={(e) => !!setValue && setValue(e.target.value)}
        //         required
        //     />
        // </div>
    );
};

export default SearchInput