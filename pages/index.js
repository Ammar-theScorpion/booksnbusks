import Link from 'next/link'
import AuthLayout from "../layouts/auth";
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {useEffect, useState} from "react";
import initFirebase from "../helpers/firbase";
import {getVerify, postSocialLogin} from "../helpers/backend_helper";
import {swalLoading} from "../components/common/alert";
import swal from "sweetalert2";
import {Form, notification} from "antd";
import {useRouter} from "next/router";
import Login, { handleLogin } from './login';
import Header from '../fragment/Header';
import { LowerBackground, UpperBackground } from '../fragment/background/BackgroundTheme';
import PreLoader from '../components/common/preloader';

const Home = () => {
    const router = useRouter()

    const [verify, setVerify] = useState(true)
    useEffect(() => {
        console.log(router.pathname);
        if (router.pathname === '/') {
            getVerify().then(({error, data, message}) => {
                if (error === false) {
                    if (data?.role === 'admin') {
                        router.push('/admin')
                    } else if (data?.role === 'parent') {
                        router.push('/parent')
                    } else if (data?.role && data?.school) {
                        if (data?.role === 'teacher') {
                            router.push('/teacher')
                        } else if (data?.role === 'student') {
                            if (data?.guardian_email) {
                                router.push('/student')
                            } else {
                                router.push('/consent')
                            }
                        }
                    } else {
                        router.push('/role')
                    }
                } else {
                    console.log(message);
                    setVerify(false)
                }
            })
        } else {
            setVerify(false)
        }
    }, [router.pathname])


    useEffect(() => {
        initFirebase()
    }, [])

    if (verify) {
        return <PreLoader />
    }
    return (
        <div className="bg-blue-50 overflow-y-hidden h-[100vh]">
            <Header />
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <UpperBackground />
                
                <div className="mx-auto max-w-2xl py-32 px-4 overflow-hidden sm:px-6 lg:px-8">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
                        <div className="text-center space-y-6">
                            <h1 className="text-balance text-5xl font-extrabold tracking-tight text-gray-900 leading-tight sm:text-5xl">
                                Motivate Students, <span className="text-[#e50004]">Transform Classrooms</span>
                            </h1>
                            <p className="mt-6 text-lg font-medium text-gray-600 leading-relaxed sm:text-xl">
                                Empowering teachers to reward growth and encourage excellence with 
                                <span className="text-[#e50004] font-semibold"> powerful insights</span>.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-4">
                                <Link href="/login">
                                <a className="rounded-md bg-[#e50004] px-5 py-3 text-base font-semibold text-white shadow-md hover:bg-[#b40003] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e50004] transition duration-300 no-underline">
                                    Get started
                                </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                <LowerBackground />
            </div>
        </div>
    )
   /* return (
        <a className="text-sm/6 font-semibold text-gray-900 no-underline hover:text-primary-primary gap-1">
                        Learn more <span aria-hidden="true">→</span>
                        </a>
        <AuthLayout>
            <div className="auth-cards">
                <h3 className="text-primary font-bold mb-3">Log in</h3>
                <button
                    type="button"
                    //onClick={handleGoogleSignIn}
                    className="btn btn-dark w-full"
                >
                    Sign in with Google
                </button>
            </div>

            <div className="auth-cards">
                <h3 className="text-primary font-bold mb-3">Sign In</h3>
                <Link href="/login">
                    <button type="button" className="btn btn-dark w-full">
                        Sign in
                    </button>
                </Link>
            </div>

            <div className="auth-cards">
                <h3 className="text-primary font-bold mb-3">Sign Up</h3>
                <Link href="/signup">
                    <button type="button" className="btn btn-dark w-full">
                        Sign up for a BooksNBucks account
                    </button>
                </Link>
            </div>
        </AuthLayout>
    )*/
}
export default Home