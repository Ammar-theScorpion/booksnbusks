import { FaEye, FaEyeDropper, FaUser } from "react-icons/fa";
import { FiBell, FiUser } from "react-icons/fi";
import { checkPermission, useFetch, userOutSideClick } from "../../../helpers/hooks";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetchUnreadNotifications, postNotificationRead } from "../../../helpers/backend_helper";
import Link from "next/link";

const ProfileNav = ({user}) => {
    const notification = checkPermission('notification', true)
    
    return (
        <div className="flex items-center gap-4 text-center justify-center">
            <div className="flex flex-row ">
                { notification && <Notifications/>}
                <div className="flex gap-3 mr-2">
                    <span className="text-right">
                        <span className="block text-sm font-medium text-black dark:text-white">
                        {user?.first_name || ''} {user?.last_name || ''}
                        </span>
                        <span className="block text-xs">{user?.email || ''}</span>
                    </span>
                    <span className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center flex">
                        <FaUser size={24}/>
                    </span>
                </div>

            </div>
        </div>
    );
}


// notification count to fetch from API server and to show in the alert list a constant
const notificationButtonCount = 6

const Notifications = () => {
    console.log('notification')
    const ref = useRef()
    const [show, setShow] = useState(false)
    userOutSideClick(ref, () => {
        setShow(false)
    })
    const router = useRouter()
    const [notifications, getNotification] = useFetch(fetchUnreadNotifications, {size: notificationButtonCount}, false)
    const [isNotificationRead, setNotificationRead] = useState(false);
    useEffect(() => {
        getNotification()
    }, [router.pathname]);



   return (
        <div className="relative mr-4" ref={ref}>
            <div className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white p-2 bg-blue-50 duration-300 ease-in-out hover:text-blue-400" role={"button"} onClick={() => setShow(!show)}>
                {!!notifications?.totalDocs && <span
                    className="bg-red-500 absolute w-5 h-5 -top-2.5 -right-2.5 rounded-full p-0.5 text-center text-white"
                    style={{fontSize: 10}}>{notifications.totalDocs > 10 ? '+9' : notifications.totalDocs }</span>}


                <svg className="fill-current " width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z" fill="" />
                </svg>
            </div>
            <div className={`${show ? 'absolute' : 'hidden'} max-h-80 overflow-y-auto overflow-x-hidden right-0 mt-2 max-w-lg bg-white shadow-xl border z-20 rounded-md`}>
                <h6 className="sticky top-0 z-50  block bg-gray-100 text-gray-500 text-center rounded-b p-2 pt-1 border">Notifications</h6>
                <div className="relative w-100 " style={{minWidth: 300}}>
                    {!!notifications?.totalDocs ? (
                        <ul className="p-0">
                            {notifications?.docs?.map((d, index) => (
                                <li className="text-gray-500 px-3 pb-1 mb-2 border-b hover:bg-slate-100 transition-all duration-300" role="button" onClick={() => {
                                    postNotificationRead({_id: d._id}).then(() => {
                                        router.push('/teacher/students/')
                                    })
                                    setShow(false)
                                }} key={index}>
                                    <p>{d?.message}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500 p-3 text-center">
                            <p>No Unread Notifications</p>
                        </div>
                    )}
                  
                </div>
                
                <div className="sticky bottom-0">
                    <Link href="/teacher/notifications">
                            <a onClick={() => setShow(false)}
                                className="block bg-gray-100 hover:bg-gray-200 transition-all duration-200 no-underline text-gray-500 text-center rounded-b p-2 pt-1 border">
                                View All
                            </a>
                    </Link>
                </div>

            </div>
        </div>
    )
}
export default ProfileNav;

/*

                {!!notifications?.totalDocs &&  (
                    <span class="z-1 bg-meta-1 absolute -top-0.5 right-0 inline h-2 w-2 rounded-full">
                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
                        <span class="absolute inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                    </span>
                )}
                    */