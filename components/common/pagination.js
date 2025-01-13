import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount = 1, page, onPageChange }) => {
    return (
        // change pagination
        <ReactPaginate
            forcePage={page - 1}
            onPageChange={({ selected }) => onPageChange && onPageChange(selected + 1)}
            pageCount={pageCount}
            nextLabel="Next"
            previousLabel="Previous"
            pageClassName="inline-block mx-1"
            pageLinkClassName="px-4 py-2 rounded-full bg-red-500 text-white font-semibold no-underline hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
            previousClassName="inline-block mx-2"
            previousLinkClassName="px-4 py-2 rounded-full bg-red-500 text-white font-semibold no-underline hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
            nextClassName="inline-block mx-2"
            nextLinkClassName="px-4 py-2 rounded-full bg-red-500 text-white font-semibold no-underline hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
            breakLabel="..."
            breakClassName="inline-block mx-1"
            breakLinkClassName="px-4 py-2 rounded-full bg-red-500 text-white no-underline"
            containerClassName="flex items-center justify-center mt-6 space-x-2"
            activeClassName="text-white"
            activeLinkClassName="px-4 py-2 rounded-full bg-red-700 text-white font-semibold shadow-md transform scale-105 transition duration-300 ease-in-out"
            renderOnZeroPageCount={null}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
        />
    );
};

export default Pagination;
