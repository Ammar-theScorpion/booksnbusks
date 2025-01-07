import React from 'react'
import { useRouter } from "next/router";
import { signOut } from '../../helpers/hooks';

const LogoutPopup = ({ showLogout, toggleogout }) => {
    const router = useRouter()
    return (
        showLogout &&
        <div className="flex w-full h-full bg-gray-900 bg-opacity-50 z-50 justify-center items-center fixed top-0 left-0">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">

                <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to log out? You will be signed out of your account.</p>


                <div className="flex justify-between">
                    <button
                        onClick={() => toggleogout(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => signOut(router)}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>


    )
}

export default LogoutPopup