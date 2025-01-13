import {Form, notification} from "antd";
import FormInput from "../components/form/FormInput";
import PasswordInput from "../components/form/PasswordInput";
import {postLogin} from "../helpers/backend_helper";
import {swalLoading} from "../components/common/alert";
import swal from "sweetalert2";
import {useRouter} from "next/router";
import AuthLayout from "../layouts/auth";
import Link from 'next/link'
import ThiredPartySignIn from "../fragment/ThiredParty";

const Login = () => {
    const router = useRouter()
    const handleLogin = async values => {
        console.log(values)
        swalLoading()
        const {error, description, token} = await postLogin(values)
        swal.close()
        if (error === false) {
            localStorage.setItem("token", token)
            await notification.success({message: "Success", description})
            await router.push('/')
        } else {

            await notification.error({message: "Error", description})
        }
    }

    console.log("Login Page")
    return (
        <AuthLayout>
            <section className="">

                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0 ">
                    <div className="w-full bg-white rounded-lg shadow sm:max-w-lg xl:p-0 mt-10">
                        <div className="space-y-3 md:space-y-6 pb-6 pt-6 px-4">

                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl flex items-center overflow-auto">
                                <img className="w-10 h-10 mr-2" src="/images/logo.png" alt="BooksNBucks Logo"/>
                                Sign in to <span className="text-primary">&nbsp;BooksNBucks</span>     
                            </h1>

                            {/* normal sign in */}
                            <Form layout="vertical" onFinish={handleLogin}>
                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                    {/* email input */}
                                    <div className="flex-1">
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900">
                                            Email
                                        </label>
                                        <FormInput name="email" placeholder="name@booksnbucks.com" isEmail required />
                                    </div>

                                    {/* password input */}
                                    <div className="flex-1">
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900">
                                            Password
                                        </label>
                                        <PasswordInput name="password" placeholder="•••••••"/>
                                    </div>
                                </div>


                                {/* or */}
                                <div className="flex items-center mt-1 mb-3 justify-center">
                                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                                    <p className="mx-3 text-sm font-medium text-gray-500 text-center leading-none">OR</p>
                                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                                </div>


                                {/* thired party sign in */}
                                <ThiredPartySignIn description={"Sign In with Google"}/>

                                
                                {/* forget password */}
                                <div className="flex justify-between pt-4">


                                    <Link href="/forget">
                                        <div className="justify-end items-end slef">
                                            <a className="text-sm font-medium text-primary hover:underline self-end">Forget Password?</a>
                                        </div>
                                    </Link>
                                </div>
                                {/* submit button */}
                                <div className="pt-3">
                                    <button type="submit" className="w-full text-white btn-primary rounded-lg text-sm px-5 py-[0.85rem] ring-0 text-center transition duration-150">Sign in</button>
                                </div>

                                <p className="text-sm font-light text-gray-500 pt-4">
                                    Don’t have an account yet?&nbsp;
                                    <Link href="/signup">
                                        <a className="font-medium text-primary hover:underline">Sign up</a>
                                    </Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </AuthLayout>

    )


    /*
        return (

    <AuthLayout>
            <div className="flex items-center pt-12" style={{minHeight: '60vh'}}>
                <div>
                    <div className="bg-white p-8 rounded shadow-sm w-screen md:w-96">
                        <h2 className="text-primary font-medium mb-3">Sign In</h2>
                        <Form layout="vertical" onFinish={handleLogin}>
                            <FormInput name="email" placeholder="Email" isEmail required/>
                            <PasswordInput name="password" placeholder="Password"/>
                            <button className="btn btn-primary btn-full mt-1">Sign In</button>
                        </Form>
                    </div>
                    <Link href="/forget">
                        <a className="mt-3 text-danger inline-block text-decoration-none">Forget Password?</a>
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )

    */
}
export default Login