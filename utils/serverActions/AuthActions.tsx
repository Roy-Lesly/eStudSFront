"use server";

import { axiosRequest } from '@/functions';
import { jwtDecode } from 'jwt-decode';
import { getSession } from './sessionAction';
import { SchemaCheckUser, SchemaConfirmResetPassword, SchemaCreatePassword, SchemaLogin, SchemaResetPassword } from '@/Domain/schemas/schemas-authentication';
import { JwtPayload } from './interfaces';

export const ActionLogin = async (loginData: unknown, url: string) => {
    var config = {}
    const result = SchemaLogin.safeParse(loginData);
    console.log(result, 12)
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: url,
        payload: result.data,
        params: "remove_payload",
        token: config
    })

    console.log(response, 33)
    
    if (response) {
        if (response?.data) {
            if (response?.data.access) {
                const token: JwtPayload = jwtDecode(response.data.access)
                const session = await getSession()
                session.user_id = token.user_id
                session.username = token.username
                session.role = token.role
                session.is_superuser = token.is_superuser
                session.dept = token.dept
                session.page = token.page
                session.school = token.school
                session.exp = new Date((token.exp ? token.exp : 0) * 1000)
                session.created_at = new Date((token.iat ? token.iat : 0) * 1000)
                session.isLoggedIn = true
                session.access = response.data.access
                session.refresh = response.data.refresh
                await session.save();
                return session
            }
            if (response.data.detail){
                return { detail: response.data.detail }
            } 
            if (response?.data.error) {
                return { error: response.data.error }
            }           
        }
        return response;
    }
    return { detail: "SERVER ERROR"}

}

export const ActionLogout = async () => {
    const session = await getSession()
    session.user_id = 0
    session.username = ''
    session.role = ''
    session.dept = []
    session.is_superuser = false
    session.isLoggedIn = false
    session.exp = new Date()
    session.created_at = new Date()
    await session.save();
    return session;
}

export const ActionCheckUser = async (checkData: unknown, url: string) => {

    var config = {}
    const result = SchemaCheckUser.safeParse(checkData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: url,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: config    
    })
    console.log(107, response)

    if (response) {
        if (response?.data) {
            return response.data
        }
        console.log("error")
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

export const ActionCreatePassword = async (loginData: unknown, id: string, url: string) => {

    const result = SchemaCreatePassword.safeParse(loginData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "put",
        url: `${url}/${id}`,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: {}
    })


    if (response) {
        if (response?.data) {
            return response.data
        }
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

export const ActionResetPassword = async (emailData: unknown, url: string) => {

    const result = SchemaResetPassword.safeParse(emailData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: url,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: {}
    })

    console.log(183, response)

    if (response) {
        if (response?.data) {
            return response.data
        }
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

export const ActionConfirmResetPassword = async (emailData: unknown, url: string) => {

    const result = SchemaConfirmResetPassword.safeParse(emailData);
    if (!result.success) {
        let errorMessage = "";

        result.error.issues.forEach((issue: any) => {
            errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
        });

        return {
            error: errorMessage
        }
    }

    const response = await axiosRequest<any>({
        method: "post",
        url: url,
        payload: {
            ...result.data
        },
        params: "remove_payload",
        token: {}
    })

    if (response) {
        if (response?.data) {
            return response.data
        }
        return { response };
    }
    return { errors: "SERVER ERROR"}

}

