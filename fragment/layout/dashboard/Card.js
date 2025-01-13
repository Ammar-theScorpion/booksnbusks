import { CardSkeleton } from "../../skeleton/CardSkeleton";

const Card=({items, loading, totalItems})=>{
    console.log(totalItems)
    return (
        <div className="flex flex-col gap-4 w-full overflow-hidden">
            {loading ? ( 
                <CardSkeleton  /> ) : (
                    <>
                        <div className="flex flex-row gap-4 w-full flex-wrap sm:flex-col">
                            {totalItems.map((item, index) => (
                                <div key={index} className="rounded-sm border border-stroke bg-white shadow-md p-6 flex items-center justify-between flex-1" >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">{item.title}</h4>
                                                <h3 className="text-xl font-bold text-gray-900">{item.value || '0'}</h3>
                                            </div>
                                        </div>
                                    </div>
                            ))}
                        </div>

                        {items.map((row, index) => (
                            <div className={`transition-opacity duration-1000 opacity-100 flex flex-wrap gap-4 ease-in`} key={index}>
                                {row.map((item, index) => (
                                    <div className={`rounded-sm border border-stroke bg-white p-6 shadow-md dark:border-strokedark dark:bg-boxdark ${item.style || "flex-1"}`} key={index}>
                                    <div className="flex flex-row items-center gap-4">
                                        <div className="bg-blue-100 rounded-full p-3 w-fit text-blue-600">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-title-md font-bold text-black dark:text-white">
                                                {item.title}
                                            </h4>
                                            <span className="text-sm font-medium">{item.subtitle}</span>
                                        </div>
                                    </div>
                                    
                                        <div className="mt-4 flex flex-col gap-2 h-60 max-h-60 overflow-y-auto">
                                            {item.body(item.value)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ))}
                    </>
                )}
        </div>
    )
}

export default Card;