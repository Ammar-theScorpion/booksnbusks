import TeacherLayout from "../../layouts/teacher";
import {useFetch} from "../../helpers/hooks";
import {fetchDashboard, fetchUser, fetchTeachers} from "../../helpers/backend_helper";
import {Col, Row} from "react-bootstrap";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from "recharts";
import moment from "moment";
import {useRouter} from "next/router";
import {Tabs} from "antd";
import { useState, useEffect, useMemo, useCallback } from 'react';
import Card from "../../fragment/layout/dashboard/Card";
import { FaFolderPlus, FaShoppingCart, FaBox, FaUserTimes, FaClipboardList, FaFolderOpen, FaRegClipboard, FaUserFriends, FaBoxOpen, FaDatabase } from "react-icons/fa"; // Import required icons
import Skeleton from "react-loading-skeleton";

const { TabPane } = Tabs;

const Home = () => {
    const router = useRouter()
    const { currentTime, oneWeekAgo, oneMonthAgo, oneYearAgo, allTime } = useMemo(() => ({
        currentTime: moment().format('YYYY-MM-DD'),
        oneWeekAgo: moment().subtract(1, 'week').format('YYYY-MM-DD'),
        oneMonthAgo: moment().subtract(1, 'month').format('YYYY-MM-DD'),
        oneYearAgo: moment().subtract(1, 'year').format('YYYY-MM-DD'),
        allTime: new Date(0),
    }), []);

    const [startTime, setStartTime] = useState(allTime.toString());
    const [dashboard, refetchDashboard, { loading } ] = useFetch(fetchDashboard, {date: currentTime, start: startTime, end: currentTime})

    useEffect(() => {
        refetchDashboard({ date: currentTime, start: startTime, end: currentTime });
    }, [startTime]);

    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        };
        return date.toLocaleDateString(undefined, options);
    };

    const handleStartTime = useCallback((inputStartTime) => {
        setStartTime(inputStartTime);
    }, []);

    const itemsBody = [
        (products)=>(
            <>
            {
                products?.length ?products.map((product, index)=>(
                    <div key={index}>
                        {/* {index + 1}. {product?._id}  */}
                        {product?._id}({product?.totalStock})<br />
                        <div className="float-right" style={{ fontSize: '12px' }}>
                            {formatDateString(product?.latestCreatedAt)}
                        </div>
                    </div>
                )) :
                (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaFolderOpen size={50} className="ml-2" />
                        <p>No recent items. </p>
                    </div>
                )
            }
            </>
        ),
        (purchases)=>(
            <>
                {purchases?.length?purchases.map((status, index)=>(
                        
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={status}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 30,
                                left: 40,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="name" type="category" width={160} />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#dc3545" />
                        </BarChart>
                    </ResponsiveContainer>
            )):
            (
                <div className="flex flex-col items-center justify-center h-full">
                    <FaDatabase size={50} className="ml-2" />
                    <p>No enough data. </p>
                </div>
            )
            }
            </>
        ),
        (statuses)=>(

            <>
            {
                statuses?.length ?statuses.map((status, index)=>(
                    <>
                        <li role={"button"} key={index} onClick={() => router.push('/teacher/purchases?status=' + status._id)} className="mb-3 pb-3 border-b flex justify-between hover:bg-slate-100 transition-all duration-500">
                            <span>{status?._id} </span>
                            <span>{status?.total} </span>
                      </li>
                    </>
                )) :
                (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaRegClipboard size={50} className="ml-2" />
                        <p>No new orders. </p>
                    </div>
                )
            }
            </>
        ),
        (logs)=>(

            <>
            {
                logs?.length ?logs.map((log, index)=>(
                    <>
                        <li role={"button"} key={index} className="mb-3 pb-3 border-b">
                            {index + 1}. {log?.student?.first_name} {log?.student?.last_name}
                        </li>
                    </>
                )) :
                (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaUserFriends size={50} className="ml-2" />
                        <p>No one is absent today. </p>
                    </div>
                )
            }
            </>
        ),
        (newPurchases)=>(
            
            <>
            {
                newPurchases?.length ?newPurchases.map((purchase, index)=>(
                    <>
                      <div key={index} className="mb-3 pb-3 border-b">
                        {purchase?.purchased_by?.first_name} {purchase?.purchased_by?.last_name}
                    </div>
                    </>
                )) :
                (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FaBoxOpen size={50} className="ml-2" />
                        <p>No new orders. </p>
                    </div>
                )
            }
            </>
        ),
    ]

    const items = [
        [
            { title: 'Recently Added Items', subtitle: dashboard?.products.length+' items', value: dashboard?.products, icon: <FaFolderPlus size={24}/>, body: itemsBody[0], style:'flex-1' },
            { title: 'Top Purchases', value: dashboard?.purchases, icon: <FaShoppingCart size={24}/>, body: itemsBody[1], style:'flex-1 flex-grow' },
        ],
        [
            { title: 'Order Status', value: dashboard?.purchaseStatus, icon: <FaClipboardList size={24}/>, body: itemsBody[2] },
            { title: 'Absent Today', value: dashboard?.absence, icon: <FaUserTimes size={24}/>, body: itemsBody[3] },
            { title: 'New Orders', value: dashboard?.newPurchases, icon: <FaBox size={24}/>, body: itemsBody[4] },
        ]
    ];
    const filters = [
        {title: "All Time", value: allTime.toString()},
        {title: "Last Year", value: oneYearAgo.toString()},
        {title: "Last Month", value: oneMonthAgo.toString()},
        {title: "Last Week", value: oneWeekAgo.toString()},
    ]
    return (
        <div className="mt-24 ">
            <div className="flex w-full max-w-45 justify-start mb-2">
                <div className="inline-flex items-center rounded-md bg-stone-200 p-1.5 dark:bg-meta-4 gap-1 transition-all duration-300">
                    {filters.map((filter, index)=>(
                        <button key={index} onClick={()=>handleStartTime(filter.value)} className={`rounded py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark transition-all duration-300
                            ${startTime === filter.value && 'bg-white'}  `}>
                            {filter.title}
                        </button>
                    ))}
                </div>
            </div>

            <Card items={items} loading={loading} />
            {/* <Row>}
                        <Row style={{ paddingBottom: '20px' }}>
                <Col>
                    <Tabs defaultActiveKey="1" onChange={handleStartTime}>
                        <TabPane tab="All Time" key={allTime.toString()} />
                        <TabPane tab="Last Year" key={oneYearAgo.toString()} />
                        <TabPane tab="Last Month" key={oneMonthAgo.toString()} />
                        <TabPane tab="Last Week" key={oneWeekAgo.toString()} />
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <h5>Recently Added Items</h5>
                        <hr/>
                        {dashboard?.products?.length ? (
                            <ul className="pl-0">
                                {dashboard.products.map((product, index) => (
                                    <li className="mb-3 pb-3 border-b" key={index}>
                                        {index + 1}. {product?._id} ({product?.totalStock})<br />
                                        <div className="float-right" style={{ fontSize: '12px' }}>
                                            {formatDateString(product?.latestCreatedAt)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recent items.</p>
                        )}
                    </div>
                </Col>
               
                <Col md={6} lg={8} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded">
                        <h5>Top Purchases</h5>
                        <hr />
                        {dashboard?.purchases && dashboard.purchases.length ? (
                            <div style={{ height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={dashboard?.purchases}
                                        layout="vertical"
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 40,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid horizontal={false} />
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis dataKey="name" type="category" width={160} />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#dc3545" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p>No recent purchases.</p>
                        )}
                    </div>
                </Col>
                
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 rounded h-full">
                        <h5>Order Status</h5>
                        <hr/>
                        {dashboard?.purchaseStatus?.length ? (
                            <ul className="pl-0">
                                {dashboard?.purchaseStatus?.map((status, index) => (
                                    <li role={"button"} key={index} onClick={() => router.push('/teacher/purchases?status=' + status._id)} className="mb-3 pb-3 border-b flex justify-between">
                                        <span>{status?._id} </span>
                                        <span>{status?.total} </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No new orders.</p>
                        )}
                    </div>
                </Col>

                
                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded">
                        <h5>Absent Today</h5>
                        <hr/>
                        {dashboard?.absence?.length ? (
                            <ul className="pl-0">
                                {dashboard?.absence?.map((log, index) => (
                                    <li role={"button"} key={index} className="mb-3 pb-3 border-b">
                                        {index + 1}. {log?.student?.first_name} {log?.student?.last_name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No one is absent today.</p>
                        )}
                    </div>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                    <div className="p-8 bg-F8 h-full rounded">
                        <h5>New Orders</h5>
                        <hr />
                        {dashboard?.newPurchases?.length ? (
                            <ul className="pl-0">
                                {dashboard?.newPurchases?.map((purchase, index) => (
                                    <li key={index} className="mb-3 pb-3 border-b">
                                        {index + 1}. {purchase?.purchased_by?.first_name} {purchase?.purchased_by?.last_name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No new orders.</p>
                        )}
                    </div>
                </Col>
            </Row>
                </Row> */}
        </div>
    )
}

Home.layout = TeacherLayout
export default Home