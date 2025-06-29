import axios, { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode'
import { getSession } from './serverActions/sessionAction';
import { CustomAxiosError, JwtPayload } from './serverActions/interfaces';
import { protocol } from './config';
import { RefreshTokenUrl } from './Domain/configDom';


const useAxios = async (domain: string) => {

    const session = await getSession()

    const axiosInstance = axios.create({
        baseURL: "",
        headers: { Authorization: `Bearer ${session?.access}`}
    })

    axiosInstance.interceptors.request.use( async req => {
        const token: JwtPayload = jwtDecode(session.access)
        const expTime = new Date(0);
        expTime.setUTCSeconds(token.exp ? token.exp : 0);
        const isExpired = ( new Date().toISOString().slice(0, 16) > (expTime.toISOString().slice(0, 16)) )
        
        if (!isExpired) { return req }
        const response = await axios.post(protocol + "api" + domain + RefreshTokenUrl, {
            refresh: session.refresh
        }).catch(
            (e: CustomAxiosError) => {
                return e.response
            }
        ) as AxiosResponse

        if (response.statusText == "Unauthorized") {
            return response.data
        }
        const newToken: JwtPayload = jwtDecode(response.data.access)
        if (newToken) {
            const session = await getSession()
            session.user_id = newToken.user_id
            session.username = newToken.username
            session.role = newToken.role
            session.is_superuser = newToken.is_superuser
            session.dept = newToken.dept
            session.page = newToken.page
            session.school = newToken.school
            session.exp = new Date((newToken.exp ? newToken.exp : 0) * 1000)
            session.created_at = new Date((newToken.iat ? newToken.iat : 0) * 1000)
            session.isLoggedIn = true
            session.access = response.data.access
            session.refresh = session.refresh
        }

        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })


    axiosInstance.interceptors.response.use( async res => {
        return res
    })

    return axiosInstance
}

export default useAxios