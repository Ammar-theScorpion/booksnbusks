import Skeleton from "react-loading-skeleton";

const HistoryAwardSkeleton=()=>{

    const awardCount = 3;
    return (
        <>
            <div className="px-6 py-4 space-y-6">
                <ul className="space-y-6">
                    {Array(awardCount).fill().map((_, rowIndex) => (
                        <li className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg transition-transform hover:scale-105" >
                            {/* Points */}
                            <span className="text-primary-primary oswald text-4xl font-bold">
                                <Skeleton count={1} width={60} height={30}/>
                            </span>

                            {/* Details */}
                            <div className="text-right flex-1 pl-4">
                                <p className="text-lg font-semibold text-gray-800 mb-1">
                                    <span className="text-sm text-gray-500 ml-2">
                                        <Skeleton count={1} width={40} height={10}/>
                                    </span>
                                </p>
                                <p className="text-base text-gray-600 mb-1">
                                    <Skeleton count={1} width={40} height={10}/>
                                </p>
                                <p className="text-sm text-indigo-500 font-medium">
                                    <Skeleton count={1} width={40} height={10}/>
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="text-center border-t border-gray-200 p-4 sticky bottom-0 bg-white">
                <div className="text-center pt-3 flex justify-center items-end gap-2">
                    <Skeleton count={1} width={30} height={30}/>
                    <Skeleton count={1} width={30} height={30}/>
                    <Skeleton circle={true} count={1} width={5} height={5}/>
                    <Skeleton circle={true} count={1} width={5} height={5}/>
                    <Skeleton circle={true} count={1} width={5} height={5}/>
                    <Skeleton count={1} width={30} height={30}/>
                    <Skeleton count={1} width={30} height={30}/>
                </div>
            </div>
        </>

    )
}

export default HistoryAwardSkeleton;