import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const TableSkeleton = ({columnCount, rowCount, pagination}) => {   
    console.log("data", rowCount)
    return (
        <div className="bg-white p-3 border shadow-md overflow-y-hidden">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="flex flex-row w-full">
                        <th className="flex w-full justify-between items-center px-6 py-3">
                            {Array(columnCount).fill().map((_, index) => (
                                <Skeleton key={index} count={1} width={150} height={15} />
                            ))}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array(rowCount).fill().map((_, rowIndex) => (
                    <tr key={rowIndex} className="flex flex-row w-full odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <th className="flex w-full justify-between items-center px-6 py-3">
                            {Array(columnCount).fill().map((_, index) => (
                                <Skeleton key={index} count={1} width={150} height={15} />
                            ))}
                        </th>
                    </tr>
                    ))}
                </tbody>
            </table>
            {pagination && (
                <div className="text-center pt-3 flex justify-center items-end gap-2">
                    <Skeleton count={1} width={30} height={30}/>
                    <Skeleton count={1} width={30} height={30}/>
                    <Skeleton circle={true} count={1} width={5} height={5}/>
                    <Skeleton circle={true} count={1} width={5} height={5}/>
                    <Skeleton circle={true} count={1} width={5} height={5}/>
                    <Skeleton count={1} width={30} height={30}/>
                    <Skeleton count={1} width={30} height={30}/>
                </div>
            )}
        </div>

    );
}   
export default TableSkeleton;