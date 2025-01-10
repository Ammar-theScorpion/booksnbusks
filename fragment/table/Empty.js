import { FaEmpire } from "react-icons/fa";

const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
        <FaEmpire size={150} /> 
        <p className="text-gray-500 dark:text-gray-400">No data found</p>
        <button type="submit" className=" text-white btn-primary rounded-lg text-sm px-5 py-[0.85rem] text-center transition duration-150">Add New Item</button>

    </div>

  );
}

export default Empty;