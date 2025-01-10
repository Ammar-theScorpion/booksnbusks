import ReactPaginate from "react-paginate";
import {AiFillCaretLeft, AiFillCaretRight} from "react-icons/ai";

const Pagination = ({pageCount = 1, page, onPageChange}) => {
    return (
        <ReactPaginate
            forcePage={page - 1}
            onPageChange={({selected}) => onPageChange && onPageChange(selected + 1)}
            pageCount={pageCount}
            nextLabel="next >"
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}            
        />
    )
}
export default Pagination