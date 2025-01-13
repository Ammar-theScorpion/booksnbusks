import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const ProductSkeleton=()=>{

    const skeletonStructure = [
        [{}, {}, {}],
        [{}, {}, {}],
    ]
    return (
        <div className="flex flex-col gap-4 transition-all duration-500">
            {skeletonStructure.map((row, index) => (
            <div className="flex flex-wrap gap-4" key={index}>
                {row.map((item, index) => (
                    <div className={` h-[19rem] bg-white p-6 rounded-lg w-full flex flex-col border border-stroke  shadow-md dark:border-strokedark dark:bg-boxdark ${item.style || "flex-1"} `} key={index}>
                        <div className="  text-center mb-4  gap-4 h-32">
                            <div className=" inline-block ">
                                <Skeleton height={100} width={100}/>
                            </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col gap-2 h-60 max-h-60 overflow-y-auto">
                            <Skeleton count={2} width={100}/>
                        </div>

                        <div className="flex justify-between">
                            <Skeleton count={1} width={50} height={30}/>
                            <Skeleton count={1} width={30} height={30}/>
                        </div>

                    </div>
                ))}
            </div>
    ))}
</div>
    )
}

export default ProductSkeleton;