import ReactPaginate from "react-paginate";
import {AiFillCaretLeft, AiFillCaretRight} from "react-icons/ai";

const Pagination = ({pageCount = 1, page, onPageChange}) => {
    return (
        <ReactPaginate
            forcePage={page - 1}
            onPageChange={({selected}) => onPageChange && onPageChange(selected + 1)}
            pageCount={pageCount}
            previousLabel={<AiFillCaretLeft size={22} className="text-white"/>}
            nextLabel={<AiFillCaretRight size={22} className="text-white"/>}
            previousClassName="bg-pink-200 border p-2 mr-2 inline-block rounded-full hover:bg-pink-300"
            nextClassName="bg-pink-200 border p-2 ml-2 inline-block rounded-full hover:bg-pink-300"
            pageClassName="inline-block border hover:cursor-pointer px-3 py-1  rounded-full hover:bg-pink-100 hover:text-primary-primary trasition-all duration-300 "
            activeClassName="bg-primary text-white border-pink-200"
            breakClassName="inline-block"
            containerClassName="flex justify-center items-center space-x-2 mt-4"
            
        />
    )
}
export default Pagination