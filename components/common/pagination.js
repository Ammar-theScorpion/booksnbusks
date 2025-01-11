import ReactPaginate from "react-paginate";

const Pagination = ({pageCount = 1, page, onPageChange}) => {
    return (
        <ReactPaginate
            forcePage={page - 1}
            onPageChange={({selected}) => onPageChange && onPageChange(selected + 1)}
            pageCount={pageCount}
            nextLabel="next >"
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link text-primary"
            previousClassName="page-item"
            previousLinkClassName="page-link text-primary"
            nextClassName="page-item"
            nextLinkClassName="page-link text-primary"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link text-primary"
            containerClassName="pagination"
            activeClassName="text-white"
            activeLinkClassName="bg-primary !text-white"
            renderOnZeroPageCount={null}            
        />
    )
}
export default Pagination