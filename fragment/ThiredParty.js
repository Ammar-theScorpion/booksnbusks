import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { swalLoading } from "../components/common/alert";
import { postSocialLogin } from "../helpers/backend_helper";
import swal from "sweetalert2";

const handleGoogleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, new GoogleAuthProvider())
        .then(async result => {
            console.log(result)
            swalLoading()
            let idToken = await result.user.getIdToken(true)
            console.log(idToken )

            postSocialLogin({idToken}).then(async ({error, msg, token}) => {
                swal.close()
                if (error === false) {
                    localStorage.setItem("token", token)
                    await notification.success({message: "Success", description: msg})
                    await router.reload()
                } else {
                    await notification.error({message: "Error", description: msg})
                }
                console.log(error, msg, token)
            })
        }).catch(() => {
        Swal.close()
    });
}


const ThiredPartySignIn = ({description}) => { // Google Sign in
    return (
        <div className="flex dark:bg-gray-800">
            <a className="px-4 py-2 w-full items-center justify-center border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" onClick={handleGoogleSignIn}>
                <img className="w-6 h-6 inline-block object-contain"  style={{width: "1.5rem", height: "1.5rem"}} src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" />
                <span>{description}</span>
            </a>
        </div>
    )
}


export default ThiredPartySignIn;