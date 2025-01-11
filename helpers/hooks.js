import { useEffect, useState } from 'react';
import swalAlert, { swalLoading } from "../components/common/alert";
import { useRouter } from "next/router";
import { notification, Spin } from 'antd'
import swal from 'sweetalert2'
import { useUserContext } from "../contexts/user";

export const useFetch = (func, query = {}, load = true) => {
    const router = useRouter()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [params, setParams] = useState({
        ...query,
        page: query?.page || 1,
        size: query?.size || 10,
    })
    useEffect(() => {
        if (load) {
            getData(params)
        }
    }, []);

    const getData = (query) => {
        setLoading(true)
        setError(false)
        setParams({ ...params, ...query })
        func({ ...params, ...query }).then(({ error, data, msg }) => {
            setLoading(false)
            if (error === false) {
                setData(data)
            } else {
                setError(true)
                setErrorMessage(msg)
            }
        }).catch(e => {
            setLoading(false)
            setError(true)
            console.log(e)
        })
    }
    return [data, getData, { query: params, loading, error, errorMessage }];
}


export const useAction = async (func, data, reload, alert = true) => {
    const key = "loadingNotification";
    notification.open({
        key,
        message: "Processing",
        description: "Please wait while the action is being executed...",
        icon: <Spin />,
        duration: 0,
    });


    try {
        const { error, msg } = await func(data);

        if (!error) {
            if (reload) reload();
            if (alert) {
                notification.success({
                    key,
                    message: "Success",
                    description: msg,
                    duration: 3,
                });
            } else {
                notification.close(key);
            }
        } else {
            notification.error({
                key,
                message: "Error",
                description: msg,
                duration: 3,
            });
        }
    } catch (err) {
        console.error(err);
        notification.error({
            key,
            message: "Error",
            description: "An unexpected error occurred.",
            duration: 3,
        });
    }
};

export const useActionConfirm = async (func, data, reload, message, confirmText) => {
    const { isConfirmed } = await swalAlert.confirm(message, confirmText)
    if (isConfirmed) {
        //swalLoading()
        const { error, msg } = await func(data)
        //swal.close()
        if (error === false) {
            if (reload) {
                reload()
            }
            await notification.success({ message: "Success", description: msg })
        } else {
            await notification.error({ message: "Error", description: msg })
        }
    }
}


export function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export const signOut = async router => {
    localStorage.removeItem('token')
    if (router) {
        await router.push('/')
    } else {
        window.location.href = '/'
    }
}


export const checkPermission = (permission, admin = false) => {
    const [state, setState] = useState(false)
    const { permission: rolePermissions, role, admin: isAdmin } = useUserContext()
    useEffect(() => {
        if (role) {
            if (role === 'admin') {
                setState(true)
            }
            if (rolePermissions?.permissions?.includes(permission)) {
                setState(true)
            }
            if (admin && isAdmin === true) {
                setState(true)
            }
        }
    }, [role, isAdmin])

    return state
}


export const userOutSideClick = (ref, func) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                func && func()
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}