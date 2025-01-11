import Link from "next/link";
import { useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import ProfileNav from "./Profile";

import { FiLogOut } from "react-icons/fi";
import { useUserContext } from "../../../contexts/user";
import { NavItem } from "../../../layouts/student";
import LogoutPopup from "../../popup/LogoutPopup";


/*
* This is a global side and nav bar
* used in all layouts 
*/
const Sidebar = ({ setOpenSidebar, openSidebar, user, sidebarItems }) => {

    // const user = useUserContext()
    const userContext = useUserContext()
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showLogout, setShowLogout] = useState(false)
    const setIndex = (index) => {
        console.log("index", index)
        setSelectedIndex(index)
    }

    const toggleogout = (show) => {
        setShowLogout(show)
    }

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                data-drawer-target="logo-sidebar"
                                data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar"
                                type="button"
                                onClick={() => setOpenSidebar(!openSidebar)}
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                    />
                                </svg>
                            </button>
                            <a className="flex ms-2 md:me-24 no-underline">
                                <div className="flex items-center justify-center" role="button">
                                    <img className="w-10 h-10 auto" src="/images/logo.png" alt="BooksNBucks Logo" />
                                    <h3 className="ml-3">BooksNBucks</h3>
                                </div>
                            </a>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <ProfileNav user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <aside id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-24 transition-transform ${openSidebar ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                aria-label="Sidebar">
                <div className="h-full pr-6 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        {sidebarItems?.map((item, index) => {

                            // <li key={index}>
                            //     <Link href={item.link}>
                            //         <a
                            //             className={`flex items-center p-2  text-dark rounded-lg no-underline hover:bg-primary-800 dark:hover:bg-primary-100 transition-all duration-300 hover:text-white ${selectedIndex === index && 'bg-primary-primary text-white'
                            //                 } `}
                            //             onClick={() => setSelectedIndex(index)}
                            //         >
                            //             {item.icon}
                            //             <span className="ms-3">{item.title}</span>
                            //         </a>
                            //     </Link>
                            // </li>
                            return <NavItem itemIndex={index} href={item.link} label={item.title} permission={item.permission}
                                icon={item.icon} setIndex={setIndex} selectedIndex={selectedIndex} childHrefs={item.childHrefs} admin={item.admin} />
                            }
                            // NavItem = ({href, label, icon: Icon, onClick, childHrefs, permission, admin = false}) => {
                            // <NavItem href="/teacher/award" label="Award" permission="award_show" icon={FiGift}/>


                        )}

                        <div className="flex mx-4 border-t">
                            <button className="pt-3 pl-2" onClick={() => toggleogout(true)}>
                                <FiLogOut className="inline-block ml-4 mr-3" /> Logout
                            </button>
                        </div>
                    </ul>
                </div>
            </aside>

            <LogoutPopup showLogout={showLogout} toggleogout={toggleogout} />


        </>


    );
}

export default Sidebar;