import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const CardSkeleton = () => {


    const totalItems = [
        [],[],[]
    ]

    const skeletonStructure = [
        [{},{}],
        [{},{}, {}],
    ];

    return (
        <>
            <div className="flex flex-row gap-4 w-full flex-wrap sm:flex-col">
                {totalItems.map((item, index) => (
                    <div key={index} className="rounded-sm border border-stroke bg-white shadow-md p-6 flex items-center justify-between flex-1 pb-8" >
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-300 rounded-full p-3 w-fit">
                                <Skeleton circle={true} height={22} width={25}/>
                            </div>
                            <div>
                                <Skeleton width={60} height={12}/>                                    
                                <Skeleton width={120} height={15}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-4 transition-all duration-500">
                    {skeletonStructure.map((row, index) => (
                    <div className="flex flex-wrap gap-4" key={index}>
                        {row.map((item, index) => (
                            <div className={`rounded-sm border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark ${item.style || "flex-1"}`} key={index}>
                            <div className="flex flex-row items-center gap-4">
                                <div className="bg-slate-300 rounded-full p-3 w-fit">
                                    <Skeleton circle={true} height={22} width={25}/>
                                </div>
                                <div>
                                    <h4 className="text-title-md font-bold text-black dark:text-white">
                                        <Skeleton width={150} height={20}/>                                    
                                    </h4>
                                    <span className="text-sm font-medium">
                                        <Skeleton width={60} height={10}/>
                                    </span>
                                </div>
                            </div>
                            
                                <div className="mt-4 flex flex-col gap-2 h-60 max-h-60 overflow-y-auto">
                                    <Skeleton count={5}/>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>

    );
}

export {CardSkeleton};