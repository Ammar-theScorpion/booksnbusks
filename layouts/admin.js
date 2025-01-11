import { useEffect, useState } from "react";
import { fetchProfile } from "../helpers/backend_helper";
import { signOut } from "../helpers/hooks";
import { UserContext } from "../contexts/user";
import { useRouter } from "next/router";
import { FiBarChart2, FiLogOut, FiUser, FiX } from "react-icons/fi";
import { NavItem } from "./student";
import { AiOutlineAppstoreAdd, AiOutlineShop } from "react-icons/ai";
import { FaListOl, FaListUl, FaUserCog, FaUserShield } from "react-icons/fa";
import Sidebar from "../fragment/layout/nav/Sidebar";

const AdminLayout = ({ children, back = true }) => {
    const router = useRouter()
    const [user, setUser] = useState()
    const [currentSchool, setCurrentSchool] = useState('')
    useEffect(() => {
        getProfile()
    }, [])


    // <NavItem href="/admin" label="Dashboard" icon={AiOutlineAppstoreAdd}/>
    // <NavItem href="/admin/schools" label="Schools"
    //          icon={AiOutlineShop}/>
    // <NavItem href="/admin/users" label="Admins" icon={FaUserShield}
    //          childHrefs={['/admin/users/create', '/admin/users/[_id]']} admin/>
    // <NavItem href="/admin/sessions" label="Sessions"
    //          icon={FaUserCog}/>
    // <NavItem href="/admin/logs" label="Logs"
    //          icon={FaListUl}/>
    const [openSidebar, setOpenSidebar] = useState(false);
    const sidebarItems = [
        { "title": "Dashboard", "link": "/admin", "icon": AiOutlineAppstoreAdd, },
        { "title": "Schools", "link": "/admin/schools", "icon": AiOutlineShop },
        { "title": "Admins", "link": "/admin/users", "icon": FaUserShield },
        { "title": "Sessions", "link": "/admin/sessions", "icon": FaUserCog },
        { "title": "Logs", "link": "/admin/logs", "icon": FaListUl },

    ];

    const getProfile = () => {
        let school = localStorage.getItem('currentSchool')
        if (!!school) {
            setCurrentSchool(localStorage.getItem('currentSchool'))
        }
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

    return (
        <UserContext.Provider value={{ ...user, getProfile, currentSchool }}>
            <div className="bg-[#F1F5F9] h-screen">
                <Sidebar setOpenSidebar={setOpenSidebar} openSidebar={openSidebar} user={user} sidebarItems={sidebarItems} admin /> 
                <div className={`box-border pt-24 flex flex-col gap-3 mr-3 flex-1 transition-all h-[97%] ${openSidebar ? 'ml-[18rem]' : 'ml-3'
                    } md:ml-[18rem]`}>
                    {children}
                </div>
            </div>
        </UserContext.Provider>

/* <aside className="nav-area">
                    <nav className="navbar">
                        <div className="site-title">
                            <img src="/images/logo.png" alt="" />
                            <h3>BooksNBucks</h3>
                            <FiBarChart2 className="mobile-menu-icon" onClick={toggleMobileMenu} size={24} />
                        </div>
                        <div className="mobile-menu">
                            <div className="menu-wrapper">
                                <div className="mobile-menu-title">
                                    <h5>Menu</h5>
                                    <FiX size={24} className="absolute right-4 top-4" onClick={toggleMobileMenu} />
                                </div>
                                <ul className="menu">
                                    <NavItem href="/admin" label="Dashboard" icon={AiOutlineAppstoreAdd} />
                                    <NavItem href="/admin/schools" label="Schools"
                                        icon={AiOutlineShop} />
                                    <NavItem href="/admin/users" label="Admins" icon={FaUserShield}
                                        childHrefs={['/admin/users/create', '/admin/users/[_id]']} admin />
                                    <NavItem href="/admin/sessions" label="Sessions"
                                        icon={FaUserCog} />
                                    <NavItem href="/admin/logs" label="Logs"
                                        icon={FaListUl} />
                                    <NavItem href="/admin/settings" label="Settings"
                    icon={FiSettings} admin/>
             </ul>
                            </div>
                            <div className="flex mx-4 border-t">
                                <button className="pt-3 pl-2" onClick={() => signOut(router)}>
                                    <FiLogOut className="inline-block ml-4 mr-3" /> Logout
                                </button>
                            </div>
                            <NavItemProfile user={user} />
                        </div>
                    </nav>
                </aside> */

          
    )
}
export default AdminLayout

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

export const Header = ({ user, currentSchool, setCurrentSchool }) => {
    return (
        <header className="bg-white mb-4 px-6 py-3 flex justify-between rounded">
            <div>
                <p className="mb-0 mt-1 font-semibold text-gray-600">Hi, {user?.first_name} {user?.last_name}</p>
            </div>
        </header>
    )
}
