import Link from "next/link";
import { useState } from "react";

const Header = () => {

    return (
        <header className="absolute inset-x-0 top-0 z-50">
        <nav
            className="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global">
            <div className="flex lg:flex-1">
                <div className="flex items-center justify-center" role="button">
                    <img className="w-10 h-10 auto" src="/images/logo.png" alt="BooksNBucks Logo"/>
                    <h3 className="ml-3 text-xl font-bold ">BooksNBucks</h3>
                </div>
            </div>
       

            <div className="flex gap-x-8 justify-center items-center">
                <div className="flex gap-3 justify-center items-center">
                    <div className="hidden sm:flex">

                        <Link href="https://apps.apple.com/us/app/booksnbucks/id1533475796">
                            <a className="flex items-center no-underline"  title="install mobile app">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="red" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                            </a>
                        </Link>
                    </div>
                    <Link href="/login">
                        <a className="flex items-center justify-center no-underline text-sm/6 font-semibold text-gray-900 hover:text-primary-primary gap-1">
                            Log in<span aria-hidden="true"> →</span>
                        </a>
                    </Link>
                </div>
            </div>
        </nav>
        </header>
    )
}

export default Header;