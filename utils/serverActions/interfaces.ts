import { AxiosError } from "axios"
import React from "react"
import { SessionOptions } from "iron-session"
import { SpecialtyInter } from "@/Domain/Utils-H/appControl/appInter"


export interface DataProps {
    [key: string]: string | boolean | number | null | any | React.ReactElement
}

export interface CustomAxiosError extends Omit<AxiosError, 'response'> {
    response?: {
        data: { 
            error: string,
            name?: string
        }
    }
}

export interface FieldProps {
    id: number, item: string, ca: number, exam: number, resit: number
}


// export interface AuthTokenInter {
//     id: number | undefined
//     username: string | undefined
//     role: string | undefined
//     permissions: string[] | undefined
//     is_superuser: boolean | undefined
//     access: string
//     refresh: string
// }

export interface SessionInter {
    user_id: number | undefined
    username: string | undefined
    role: string | undefined
    permissions: string[] | undefined
    dept: string[] | undefined
    page: string[] | undefined
    school: string[] | undefined
    is_superuser: boolean | undefined
    isLoggedIn: boolean
    exp: any | undefined
    created_at: any | undefined
    access: any | undefined
    refresh: any | undefined
}

export interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    user_id?: number;
    username?: string;
    is_superuser?: boolean;
    is_staff?: boolean;
    is_active?: boolean;
    is_hod?: boolean;
    role?: string;
    dept?: any;
    page?: any;
    school?: any;
    language?: string[];
    last_login?: any;
}

export const defaultSession: SessionInter = {
    user_id: 0,
    username: undefined,
    role: undefined,
    permissions: undefined,
    dept: undefined,
    page: undefined,
    school: undefined,
    is_superuser: false,
    isLoggedIn: false,
    exp: undefined,
    created_at: undefined,
    access: "",
    refresh: "",
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: "iron_token",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}


export interface CustomUserInter {
    id: number,
    username: string
    matricle: string
    first_name: string
    last_name: string
    full_name: string
    role: string
    sex: string
    dob: string
    pob: string
    address: string
    telephone?: string
    title?: string
    password?: string
    email?: string
    email_confirmed?: boolean
    is_superuser?: boolean
    is_active?: boolean
    created_at: string
    updated_at: string
}


export interface ProgramInter {
    id: number,
    name: string
    description: string
    created_at: string
}


export interface UserProfileInter {
    id: number,
    user: CustomUserInter
    specialty?: SpecialtyInter
    program?: ProgramInter
    session: string
    created_at: string
    updated_at: string
}




export interface UserProfilePrimInter {
    id: number,
    customuser: CustomUserInter
    specialty?: SpecialtyInter
    program?: ProgramInter
    session: string
    created_at: string
    updated_at: string
}



export interface SelectedPromoteStudentInter {
    user_id: number,
    created_by_id: number
}
