import {useEffect, useRef, useState} from "react";
import {fetchProfile, fetchUnreadNotifications, postNotificationRead} from "../helpers/backend_helper";
import {checkPermission, signOut, useFetch, userOutSideClick} from "../helpers/hooks";
import {UserContext, useUserContext} from "../contexts/user";
import {useRouter} from "next/router";
import {
    FiBell,
    FiUser,
} from "react-icons/fi";
import Link from "next/link";
import Sidebar from "../fragment/layout/nav/Sidebar";
import { MdOutlineDashboard } from "react-icons/md";
import { FiArchive, FiUsers } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineStar } from "react-icons/ai";
import { IoSchoolOutline, IoBookOutline } from "react-icons/io5";
import { TbTrophy } from "react-icons/tb";
const TeacherLayout = ({children, back = true}) => {
    const router = useRouter()
    const [user, setUser] = useState()
    const [openSidebar, setOpenSidebar] = useState(false);

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = () => {
        fetchProfile().then(({error, data}) => {
            if (error === false) {
                setUser(data)
            } else {
                router.push('/')
            }
        })
    }

    const toggleMobileMenu = () => {
        try {
            document.querySelector('.mobile-menu').classList.toggle('active')
        } catch (e) {

        }
    }

    if (!user) {
        return <></>
    }

    const iconSize = 24;
    const sidebarItems = [
        { "title": "Dashboard", "link": "/teacher", "icon": <MdOutlineDashboard size={iconSize} /> },
        { "title": "Inventory", "link": "/teacher/inventory", "icon": <FiArchive size={iconSize} /> },
        { "title": "Purchases", "link": "/teacher/purchases", "icon": <AiOutlineShoppingCart size={iconSize} /> },
        { "title": "Faculty Roster", "link": "/teacher/roster", "icon": <FiUsers size={iconSize} /> },
        { "title": "Student Roster", "link": "/teacher/students", "icon": <IoSchoolOutline size={iconSize} /> },
        { "title": "Virtues", "link": "/teacher/traits", "icon": <AiOutlineStar size={iconSize} /> },
        { "title": "Award", "link": "/teacher/award", "icon": <TbTrophy size={iconSize} /> },
        { "title": "Classes", "link": "/teacher/classes", "icon": <IoBookOutline size={iconSize} /> },
    ];
    
    return (
        <UserContext.Provider value={{...user, getProfile}}>
            <Sidebar setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} user={user} sidebarItems={sidebarItems}/>
                <div className={`pb-10 mr-3 flex-1 transition-all ${
                    openSidebar ? 'ml-[18rem]' : 'ml-0'
                    } sm:ml-[18rem]`}>
                    {children}
                </div>

            {/*}
            <main className="dashboard-layout">
                <aside className="nav-area print:!hidden">
                    <nav className="navbar">
                        <div className="site-title">
                            <img src="/images/logo.png" alt=""/>
                            <h3>BooksNBucks</h3>
                            <FiBarChart2 className="mobile-menu-icon" onClick={toggleMobileMenu} size={24}/>
                        </div>
                        <div className="mobile-menu">
                            <div className="menu-wrapper">
                                <div className="mobile-menu-title">
                                    <h5>Menu</h5>
                                    <FiX size={24} className="absolute right-4 top-4" onClick={toggleMobileMenu}/>
                                </div>
                                <ul className="menu">
                                    <NavItem href="/teacher" label="Dashboard" icon={AiOutlineAppstoreAdd}/>
                                    <NavItem href="/teacher/inventory" label="Inventory" permission="inventory_show"
                                             icon={AiOutlineShop}/>
                                    <NavItem href="/teacher/purchases" label="Purchases" permission="order_show"
                                             icon={FiShoppingBag}/>
                                    <NavItem href="/teacher/roster" label="Faculty Roster" permission="roster_teacher"
                                             icon={FiUsers}/>
                                    <NavItem href="/teacher/students" label="Student Roster" permission="roster_student"
                                             icon={FiUsers}/>
                                    <NavItem href="/teacher/traits" label="Virtues" permission="virtue_show"
                                             icon={FiTag}/>
                                    <NavItem href="/teacher/award" label="Award" permission="award_show" icon={FiGift}/>
                                    <NavItem href="/teacher/classes" label="Classes" permission="class_show"
                                             icon={FiCalendar}
                                             childHrefs={['/teacher/classes/create']}/>
                                    <NavItem href="/teacher/attendance" label="Attendance" permission="attendance_show"
                                             icon={BsCalendarCheck}/>
                                    <NavItem href="/teacher/quiz" label="Quiz" permission="quiz_show"
                                             icon={AiOutlineQuestionCircle}
                                             childHrefs={['/teacher/quiz/create', '/teacher/submissions/[quiz]']}
                                    />
                                    <NavItem href="/teacher/roles" label="Roles" icon={BsCalendarCheck}
                                             permission="role_show"
                                             childHrefs={['/teacher/roles/create', '/teacher/roles/[_id]']} admin/>
                                    <NavItem href="/teacher/users" label="Users" icon={BsCalendarCheck}
                                             permission="user_show"
                                             childHrefs={['/teacher/users/create', '/teacher/users/[_id]']} admin/>
                                    <NavItem href="/teacher/settings" label="Settings" permission="settings"
                                             icon={FiSettings} admin/>
                                </ul>
                            </div>
                            <div className="flex mx-4 border-t">
                                <button className="pt-3 pl-2" onClick={() => signOut(router)}>
                                    <FiLogOut className="inline-block ml-4 mr-3"/> Logout
                                </button>
                            </div>
                            <NavItemProfile user={user}/>
                        </div>
                    </nav>
                </aside>
                <div className="main-container">
                    <Header user={user}/>
                    <div className="w-full overflow-x-hidden">
                        {children}
                    </div>
                </div>
            </main>
            */}
        </UserContext.Provider>
    )
}
export default TeacherLayout

export const NavItemProfile = ({user}) => {
    return (
        <div className="p-3 rounded-xl absolute" style={{bottom: 24, left: 24, right: 24, background: '#f3f4f6'}}>
            <div className="flex items-center">
                <div className="bg-primary overflow-hidden flex justify-center items-center mr-3"
                     style={{height: 40, width: 40, borderRadius: 40}}>
                    <FiUser size={18} className="text-white"/>
                </div>
                <div>
                    <p className="font-semibold text-base mb-0 oswald">{user?.first_name || ''} {user?.last_name || ''}</p>
                    <p className="text-sm mb-0 oswald">{user?.email || ''}</p>
                </div>
            </div>
        </div>
    )
}

export const Header = ({user}) => {
    const notification = checkPermission('notification', true)
    return (
        <header className="bg-white mb-4 px-6 py-3 flex justify-between rounded">
            <div>
                <p className="mb-0 mt-1 font-semibold text-gray-600">Hi, {user?.first_name} {user?.last_name}</p>
            </div>
            <div className="flex items-center">
                {notification && (
                    <Notifications/>
                )}
                <img src={user?.school?.logo} alt="" className="h-8 mr-3"/>
                <p className="mb-0 text-gray-600 font-semibold">{user?.school?.name}</p>
            </div>
        </header>
    )
}

// notification count to fetch from API server and to show in the alert list a constant
const notificationButtonCount = 6

const Notifications = () => {
    const ref = useRef()
    const [show, setShow] = useState(false)
    userOutSideClick(ref, () => {
        setShow(false)
    })
    const router = useRouter()
    const [notifications, getNotification] = useFetch(fetchUnreadNotifications, {size: notificationButtonCount}, false)

    useEffect(() => {
        getNotification()
    }, [router.pathname]);


    return (
        <div className="relative mr-4" ref={ref}>
            <div className="flex items-center mx-1 relative" role={"button"} onClick={() => setShow(!show)}>
                {!!notifications?.totalDocs && <span
                    className="bg-red-500 absolute w-5 h-5 -top-2.5 -right-2.5 rounded-full p-0.5 text-center text-white"
                    style={{fontSize: 10}}>{notifications.totalDocs}</span>}
                <FiBell size={22}/>
            </div>
            <div
                className={`${show ? 'absolute' : 'hidden'}  right-0 mt-2 max-w-lg bg-white rounded shadow-xl border z-20`}>
                <h4 className="px-2 py-1 text-base border-b mb-2">Notifications</h4>
                <div className="relative w-100 " style={{minWidth: 300}}>
                    {!!notifications?.totalDocs ? (
                        <ul className="p-0">
                            {notifications?.docs?.map((d, index) => (
                                <li className="text-gray-500 px-3 pb-1 mb-2 border-b" role="button" onClick={() => {
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
                    <Link href="/teacher/notifications">
                        <a onClick={() => setShow(false)}
                           className=" block text-gray-500 text-center text-black rounded-b p-2 pt-1 border">View
                            All</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}
