import axios from "axios"

//apply base url for axios
const API_URL = process.env.backend_url + "api"

const axiosApi = axios.create({
    baseURL: API_URL,
    validateStatus: function (status) {
        if (status === 404 || status === 401) {
            let pathName = window.location.pathname
            if (pathName?.indexOf('/student') === 0 || pathName?.indexOf('/teacher') === 0) {
                window.location.replace('/');
            }
        }
        console.log(status)
        return status >= 200 && status < 600 // default
    },
})

axiosApi.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
)

export async function get(url, data, config = {}) {
    axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
    return await axiosApi.get(url, { ...config, params: { school: localStorage.getItem('currentSchool'), ...data } }).then(response => response.data)

    /*
    try{
        
        axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
        const reponse = await axiosApi.get(url, {...config, params: {school: localStorage.getItem('currentSchool'), ...data}});
        return {error:false, data: reponse.data};
    } catch (err) {
        return { error: true, message: err.response?.data?.message || err.message };
    }*/
}

export async function post(url, data, config = {}) {
    axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
    return await axiosApi.post(url, data, { ...config, params: { school: localStorage.getItem('currentSchool') } }).then(response => response.data)

    /*try {
        axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
        const response = axiosApi
        .post(url, data, {...config, params: {school: localStorage.getItem('currentSchool')}});
        return {error: false, token: response.data};
    } catch (err) {
        return { error: true, description: err.response?.data?.message || err.message };
    }*/
}

export async function put(url, data, config = {}) {
    axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
    return axiosApi
        .put(url, { ...data }, { ...config })
        .then(response => response.data)
}

export async function del(url, data, config = {}) {
    axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
    return await axiosApi
        .delete(url, { ...config, params: { school: localStorage.getItem('currentSchool'), ...data } })
        .then(response => response.data)
}


export const convertObjectToFormData = (object) => {
    axiosApi.defaults.headers.common["Authorization"] = `Authorization ${localStorage.getItem('token') ?? ''}`
    let form_data = new FormData()
    for (let key in object) {
        if (object[key] !== null) {
            form_data.append(key, object[key])
        }
    }
    return form_data
}