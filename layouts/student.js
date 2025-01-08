import Link from 'next/link'
import {
    FiArrowLeft,
    FiBarChart2,
    FiCalendar,
    FiHeart,
    FiHome,
    FiLogOut, FiMinusCircle, FiPlusCircle,
    FiShoppingBag,
    FiShoppingCart,
    FiStar, FiTrash,
    FiX
} from "react-icons/fi";
import { useRouter } from "next/router";
import { signOut, userOutSideClick } from "../helpers/hooks";
import SimpleBar from 'simplebar-react';
import { useEffect, useRef, useState } from "react";
import { fetchProfile } from "../helpers/backend_helper";
import PreLoader from "../components/common/preloader";
import { UserContext, useUserContext } from "../contexts/user";
import { NavItemProfile } from "./teacher";
import { AiOutlineQuestionCircle } from "react-icons/ai";


const StudentLayout = ({ children }) => {
    const router = useRouter()
    const [user, setUser] = useState()
    const [approved, setApproved] = useState(true)

    useEffect(() => {
        getProfile()
    }, [])

    const [cart, setCart] = useState([])

    const addToCart = (product, inc) => {
        let find = cart?.find(d => d._id === product._id)
        let newCart
        if (!!find) {
            find.quantity += inc
            newCart = cart?.filter(d => d?.quantity > 0)
            setCart(newCart)
        } else {
            newCart = [
                ...cart,
                {
                    ...product,
                    quantity: inc
                }
            ]
            setCart(newCart)
        }
        localStorage.setItem('cart', JSON.stringify(newCart))
    }

    const clearCart = () => {
        setCart([])
        localStorage.setItem('cart', JSON.stringify([]))
    }

    useEffect(() => {
        const data = localStorage.getItem('cart')
        if (!!data) {
            setCart(JSON.parse(data))
        }
    }, [])


    const isWishlist = id => {
        return user?.wishlist?.find(wish => wish === id) !== undefined
    }

    const toggleMobileMenu = () => {
        try {
            document.querySelector('.mobile-menu').classList.toggle('active')
        } catch (e) {

        }
    }

    const getProfile = () => {
        fetchProfile().then(({ error, data }) => {
            if (error === false && data.guardian_email) {
                if (data?.status === 'approved') {
                    setUser(data)
                } else {
                    setApproved(false)
                }
            } else {
                router.push('/')
            }
        })
    }

    const [showCart, setShowCart] = useState(false)
    const ref = useRef()
    userOutSideClick(ref, () => setShowCart(false))

    if (!approved) {
        return (
            <div className="flex min-h-screen justify-center py-12">
                <div className="text-center max-w-2xl">
                    <h2 className="text-center text-danger">Your account is currently under approval by your guardian.
                        Have your guardian grant you access to your account by checking their email. Refresh this page
                        once they have granted you approval to see your account.
                    </h2>

                    <button className="btn btn-primary w-full md:w-96 mt-3" onClick={() => router.push('/consent')}>Send
                        Again
                    </button>
                    <br />
                    <button className="btn btn-dark w-full md:w-96 mt-3" onClick={() => signOut(router)}>Sign Out
                    </button>
                </div>
            </div>
        )
    }

    if (!user) {
        return <PreLoader />
    }

    return (
        <UserContext.Provider value={{ ...user, getProfile, isWishlist, cart, addToCart, setShowCart, clearCart }}>
            <div ref={ref} className={`fixed right-0 bottom-0 top-0 ${showCart ? 'w-80' : 'w-0'} transition-all shadow-lg bg-white z-50`}>
                <div className="flex px-4 py-3 border-b items-center">
                    <FiArrowLeft size={18} role="button" onClick={() => setShowCart(false)} />
                    <span className="text-lg px-2">Order Details</span>
                </div>
                <div className="p-4">
                    <p className="text-lg">My Cart</p>
                    <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                        {cart?.map((product, index) => (
                            <div key={index} className="flex relative border-b mb-2">
                                <div className="px-2">
                                    <img src={product?.image} className="w-14" alt="" />
                                </div>
                                <div className="mb-2.5">
                                    <p className="font-semibold mb-1">{product?.name}</p>
                                    <p className="mb-1">{product?.cost} Points</p>
                                    <div className="flex items-center">
                                        <FiMinusCircle role="button" size={20} onClick={() => addToCart(product, -1)} />
                                        <span className="mb-0 text-primary pointer-events-none font-bold px-2">{product.quantity}</span>
                                        <FiPlusCircle role="button" size={20} onClick={() => addToCart(product, 1)} />
                                    </div>
                                    <FiTrash className="absolute right-0 bottom-4" role="button" onClick={() => addToCart(product, -product.quantity)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <p>Total</p>
                        <p>{cart?.reduce((acc, d) => acc + ((d.cost * d.quantity) || 0), 0)} Points</p>
                    </div>
                    <div className="flex items-center py-2">
                        <Link href="/student/checkout">
                            <button onClick={() => setShowCart(false)} className="btn btn-primary mx-auto">Checkout</button>
                        </Link>
                    </div>
                </div>
            </div>
            <main className="dashboard-layout">
                <aside className="nav-area">
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
                                    {/*<NavItem href="/student" label="Home" icon={FiHome}/>*/}
                                    {/*<NavItem href="/student/points" label="Points" icon={FiStar}/>*/}
                                    <NavItem href="/student/store" label="Store" icon={FiShoppingBag} />
                                    <NavItem href="/student/checkout" label="Checkout" icon={FiShoppingCart} />
                                    <NavItem href="/student/purchases" label="Purchases" icon={FiShoppingBag} />
                                    <NavItem href="/student/wishlist" label="Wishlist" icon={FiHeart} />
                                    {/*<NavItem href="/student/attendance" label="Attendance" icon={FiCalendar}/>*/}
                                    <NavItem href="/student/quiz" label="Quizzes" icon={AiOutlineQuestionCircle} />
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
                </aside>
                <div className="main-container">
                    <Header user={user} />
                    <div>
                        {children}
                    </div>
                </div>
            </main>
        </UserContext.Provider>

    )
}
export default StudentLayout


export const NavItem = ({ itemIndex, href, label, icon: Icon, onClick, childHrefs, permission, admin = false, setIndex, selectedIndex }) => {
    const handleClick = () => {
        try {
            document.querySelector('.mobile-menu').classList.remove('active')
        } catch (e) {

        }
        if (onClick) {
            onClick()
        }
    }
    const router = useRouter()

    const user = useUserContext()
    if (permission && !user?.permission?.permissions?.includes(permission) && !admin && user.role !== 'admin') {
        return <></>
    }
    if (admin && user?.admin !== true && user.role !== 'admin') {
        return <></>
    }
    {

        console.log(href + "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        console.log(router.pathname + "tt")

    }

    return (
        <li>
            <Link href={href || '#!'} className="flex-1">
                {/* <a onClick={handleClick}
                    className={router.pathname === href || router.pathname === href + /[_id] || childHrefs?.includes(router.pathname) ? 'active' : ''}>
                    <Icon size={18} /> <span>{label}</span>
                </a> */}



                <a
                    className={` ${router.pathname === href && 'bg-primary-primary text-white'} flex h-full items-center p-2 text-dark rounded-lg no-underline 
                    hover:bg-primary-800 dark:hover:bg-primary-100 transition-all duration-300 
                    hover:text-white 
                    `}
                    onClick={() => { setIndex(itemIndex) }}
                >
                    <Icon size={18} /> <span className='ml-5'>{label}</span>
                </a>
            </Link>
        </li>
    )
}
/*export const NavItem = ({href, label, icon: Icon, onClick, childHrefs, permission, admin = false}) => {
    const handleClick = () => {
        try {
            document.querySelector('.mobile-menu').classList.remove('active')
        } catch (e) {

        }
        if (onClick) {
            onClick()
        }
    }
    const router = useRouter()

    const user = useUserContext()
    if (permission && !user?.permission?.permissions?.includes(permission) && !admin && user.role !== 'admin') {
        return <></>
    }
    if (admin && user?.admin !== true && user.role !== 'admin') {
        return <></>
    }

    return (
        <li>
            <Link href={href || '#!'}>
                <a onClick={handleClick}
                   className={router.pathname === href || router.pathname === href + `/[_id]` || childHrefs?.includes(router.pathname) ? 'active' : ''}>
                    <Icon size={18}/> <span>{label}</span>
                </a>
            </Link>
        </li>
    )
}*/

export const Header = ({ user }) => {
    const { cart, setShowCart } = useUserContext()
    return (
        <>
            <header className="bg-white mb-4 px-6 py-3 flex justify-between rounded">
                <div>
                    <p className="mb-0 mt-1 font-semibold text-gray-600">Hi, {user?.first_name} {user?.last_name}</p>
                </div>
                <div className="flex items-center">
                    <div className="relative mr-6" role="button" onClick={() => setShowCart(true)}>
                        <FiShoppingCart className="font-semibold" size={22} />
                        <div
                            className="absolute !border border-gray-700 px-1.5 -top-3 -right-3 text-[12px] font-bold text-primary rounded-full ">
                            {cart.length}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <img src={user?.school?.logo} alt="" className="h-8 mr-3" />
                        <p className="mb-0 text-gray-600 font-semibold">{user?.school?.name}</p>
                    </div>
                </div>
            </header>
        </>
    )
}