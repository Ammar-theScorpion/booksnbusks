import TeacherLayout from "../../../layouts/teacher";
import {Button} from "antd";
import {fetchNotifications, postNotificationRead} from "../../../helpers/backend_helper";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import { FaArrowRight, FaClock } from "react-icons/fa";

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [page, setPage] = useState(0)
    const [last, setLast] = useState(1)
    const [loading, setLoading] = useState(false)
    const [clearNotificationsMessageVisible, setClearNotificationsMessageVisible] = useState(false);
    const router = useRouter()

    useEffect(() => {
        if (page === 0) {
            getNotifications()
        }

    }, [])

    const getNotifications = () => {
        setLoading(true)
        fetchNotifications({page: page + 1, size: 10}).then(({error, data}) => {
            if (error === false) {
                setNotifications([...notifications, ...data.docs])
                setPage(data.page)
                setLast(data.totalPages)
            }
            setLoading(false)
        })
    }

    const clearNotifications = () => {
        // Clear all notifications, mark all as read
        postNotificationRead({_id: "all"}).then(({error}) => {
            if (error === false) {
                setLoading(true)
                    fetchNotifications({page: 1, size: 10}).then(({error, data}) => {
                    if (error === false) {
                        setNotifications([...data.docs])
                        setPage(data.page)
                        setLast(data.totalPages)
                    }
                    setLoading(false)
                })
                setClearNotificationsMessageVisible(true); // Set message visibility to true
                setTimeout(() => {
                    setClearNotificationsMessageVisible(false); // Hide the message after a certain time
                }, 5000); // Certain time is 5000 milliseconds (5 seconds) here.
            }
        })
    }

    // This text box will only show up temporarily when clear notifications is clicked
    return (
        <>
            <h5 className="font-bold">Notifications</h5>
            {clearNotificationsMessageVisible && (
                <div
                 style={{ background: "#C5CDB3",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "8px",
                    marginBottom: "20px"
                    }}
                >
                 All notifications have been cleared.
                </div>
            )}
            <ul className="p-0">
                {notifications?.map((d, index) => (
                    <li
                    className="px-6 py-4 mb-4 bg-white rounded-lg shadow-md hover:cursor-pointer hover:shadow-lg relative transition-shadow duration-200 ease-in-out"
                    role="button"
                    onClick={() => {
                        postNotificationRead({ _id: d._id }).then(() => {
                            router.push('/teacher/students/');
                        });
                    }}
                    key={index}
                >
                    {/* Notification Content */}
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            {/* Message */}
                            <p className="text-gray-800 font-medium text-sm">
                                {d?.message}
                            </p>
                            {/* Time */}
                            <span className="flex items-center gap-2 text-gray-500 text-xs">
                                <FaClock className="text-blue-500" />
                                {new Date(d?.createdAt).toLocaleDateString()}{' '}
                                {new Date(d?.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <div className="hover:text-blue-400 hover:shadow-lg transition-all duration-300 bg-blue-100 rounded-full w-10 h-10 px-2 flex items-center justify-center">
                            <FaArrowRight />
                        </div>
                    </div>
                    {/* Unread Indicator */}
                    {!d?.read && (
                        <div className="w-3 h-3 rounded-full absolute left-2 -top-[0.4rem] bg-blue-500 animate-pulse" />
                    )}
                </li>
                
                ))}
            </ul>
            {loading && <div></div>}
            <div className="flex justify-between items-center mt-4">
                {/* Load More Button */}
                {page < last && (
                    <Button
                        className="flex text-center justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ease-in-out"
                        onClick={getNotifications}>
                        Load More
                    </Button>
                )}
                {/* Clear Notifications Button */}
                <Button
                    className="flex text-center justify-center items-center px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition duration-200 ease-in-out"
                    onClick={clearNotifications}
                >
                    Clear Notifications
                </Button>
            </div>

        </>
    )
}
Notifications.layout = TeacherLayout
export default Notifications