import { useEffect, useRef, useState } from "react";
import { fetchProfile, fetchUnreadNotifications, postNotificationRead } from "../helpers/backend_helper";
import { checkPermission, signOut, useFetch, userOutSideClick } from "../helpers/hooks";
import { UserContext, useUserContext } from "../contexts/user";
import { useRouter } from "next/router";
import {
    FiBell,
    FiSettings,
    FiUser,
} from "react-icons/fi";
import Link from "next/link";
import Sidebar from "../fragment/layout/nav/Sidebar";
import { MdOutlineDashboard } from "react-icons/md";
import { FiArchive, FiUsers } from "react-icons/fi";
import { AiOutlineQuestionCircle, AiOutlineShoppingCart, AiOutlineStar } from "react-icons/ai";
import { IoSchoolOutline, IoBookOutline } from "react-icons/io5";
import { TbTrophy, TbUsersGroup } from "react-icons/tb";
import { BsCalendarCheck } from "react-icons/bs";
const TeacherLayout = ({ children, back = true }) => {
    const router = useRouter()
    const [user, setUser] = useState()
    const [openSidebar, setOpenSidebar] = useState(false);

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = () => {
        fetchProfile().then(({ error, data }) => {
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
        { "title": "Dashboard", "link": "/teacher", "icon": MdOutlineDashboard, "permission": "" },
        { "title": "Inventory", "link": "/teacher/inventory", "icon": FiArchive, "permission": "inventory_show" },
        { "title": "Purchases", "link": "/teacher/purchases", "icon": AiOutlineShoppingCart, "permission": "order_show" },
        { "title": "Faculty Roster", "link": "/teacher/roster", "icon": FiUsers, "permission": "roster_teacher" },
        { "title": "Student Roster", "link": "/teacher/students", "icon": IoSchoolOutline, "permission": "roster_student" },
        { "title": "Virtues", "link": "/teacher/traits", "icon": AiOutlineStar, "permission": "virtue_show" },
        { "title": "Award", "link": "/teacher/award", "icon": TbTrophy, "permission": "award_show" },
        { "title": "Classes", "link": "/teacher/classes", "icon": IoBookOutline, "permission": "class_show", "fs": ['/teacher/classes/create'], "childHrefs": ['/teacher/classes/create'] },
        ////
        { "title": "Attendance", "link": "/teacher/attendance", "icon": BsCalendarCheck, "permission": "attendance_show" },
        { "title": "Quiz", "link": "/teacher/quiz", "icon": AiOutlineQuestionCircle, "permission": "quiz_show", "childHrefs": ['/teacher/quiz/create', '/teacher/submissions/[quiz]'] },
        { "title": "Roles", "link": "/teacher/roles", "icon": BsCalendarCheck, "permission": "role_show", "childHrefs": ['/teacher/roles/create', '/teacher/roles/[_id]'], "admin": true },
        { "title": "Users", "link": "/teacher/users", "icon": TbUsersGroup, "permission": "user_show", "childHrefs": ['/teacher/users/create', '/teacher/users/[_id]'], "admin": true },
        { "title": "Settings", "link": "/teacher/settings", "icon": FiSettings, "permission": "settings", "admin": true },

    ];

    return (
        <UserContext.Provider value={{ ...user, getProfile }}>
            <Sidebar setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} user={user} sidebarItems={sidebarItems} />
            <div className={`box-border pt-24 flex flex-col gap-3 pb-10 mr-3 flex-1 transition-all ${openSidebar ? 'ml-[18rem]' : 'ml-0'
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

export const NavItemProfile = ({ user }) => {
    return (
        <div className="p-3 rounded-xl absolute" style={{ bottom: 24, left: 24, right: 24, background: '#f3f4f6' }}>
            <div className="flex items-center">
                <div className="bg-primary overflow-hidden flex justify-center items-center mr-3"
                    style={{ height: 40, width: 40, borderRadius: 40 }}>
                    <FiUser size={18} className="text-white" />
                </div>
                <div>
                    <p className="font-semibold text-base mb-0 oswald">{user?.first_name || ''} {user?.last_name || ''}</p>
                    <p className="text-sm mb-0 oswald">{user?.email || ''}</p>
                </div>
            </div>
        </div>
    )
}

export const Header = ({ user }) => {
    const notification = checkPermission('notification', true)
    return (
        <header className="bg-white mb-4 px-6 py-3 flex justify-between rounded">
            <div>
                <p className="mb-0 mt-1 font-semibold text-gray-600">Hi, {user?.first_name} {user?.last_name}</p>
            </div>
            <div className="flex items-center">
                {notification && (
                    <Notifications />
                )}
                <img src={user?.school?.logo} alt="" className="h-8 mr-3" />
                <p className="mb-0 text-gray-600 font-semibold">{user?.school?.name}</p>
            </div>
        </header>
    )
}

