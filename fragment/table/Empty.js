import { FaEmpire, FaSearchMinus } from "react-icons/fa";

const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
        <FaEmpire size={150} /> 
        <p className="text-gray-500 dark:text-gray-400">No data found</p>
        <button type="submit" className=" text-white btn-primary rounded-lg text-sm px-5 py-[0.85rem] text-center transition duration-150">Add New Item</button>

    </div>

  );
}

{/* should be displayed after getting no results from searching */}
import { FaSearch } from 'react-icons/fa';

const EmptySearch = ({ searchString }) => {
  return (
    <div className="h-full">
        <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-md shadow-inner h-full">
            <FaSearchMinus className="text-gray-400 text-6xl mb-4" />
            <h4 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h4>
            <p className="text-gray-600">
              We couldn’t find any matches for <span className="font-bold">"{searchString}"</span>. <br />
              Try adjusting your search terms or using different keywords.
            </p>
        </div>
    </div>

  );
};

export {Empty, EmptySearch};