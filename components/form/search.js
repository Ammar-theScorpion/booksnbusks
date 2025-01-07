const SearchInput = ({ value, setValue }) => {
    return (
        <div className="relative w-full max-w-sm">
            <div
                className="absolute top-0 left-0 p-2.5 text-sm font-medium h-full text-white bg-primary-primary border border-primary-50"
            >
                <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                </svg>
                <span className="sr-only">Search</span>
            </div>
            <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 pl-10 w-full text-gray-900 bg-gray-50 border border-pink-700  text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-primary-800"
                placeholder="Search..."
                value={value}
                onChange={(e) => !!setValue && setValue(e.target.value)}
                required
            />
        </div>
    );
};

export default SearchInput