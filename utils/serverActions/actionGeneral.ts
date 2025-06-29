
import { axiosRequest } from "@/functions";
import { jwtDecode } from "jwt-decode";
import useAxios from "@/useAxios";
import { collectMoney } from "@/payment";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import { JwtPayload } from "./interfaces";
import { getSession } from "./sessionAction";



export const ActionCreate = async (data: unknown, schema: any, url: string, revalUrl?: string) => {

    const session = await getSession()
    var created_by_id = null
    if (session){
        var t:JwtPayload = jwtDecode(session.access)
        created_by_id = t.user_id
    }
    var config = {}

    const result = schema.safeParse(data);
    if (!result.success) {
        let errorMessage: any = {};

        result.error.issues.forEach((issue: any) => {
            errorMessage[issue.path[0]] = issue.message;
        });

        return { error: errorMessage }
    }
    if (session.access && session.access.length > 10) {
        config = { headers: { Authorization: `Bearer ${session.access}`}}
    }

    var response = null
    if (url.includes("token")){
        response = await axiosRequest<any>({
            method: "post",
            url: url,
            payload: { ...result.data },
            params: "remove_payload",
            token: config
        })
    } else {
        response = await axiosRequest<any>({
            method: "post",
            url: url,
            payload: {
                ...result.data, created_by_id: created_by_id
            },
            params: "remove_payload",
            token: config
        })
    }

    if (response) {
        if (response.data) {
            return response.data
        }
        if (response?.data.errors) {
            return { errors: response.data.errors };
        }
        if (response?.data.error?.toString().includes("[WinError]")) {
            return { Error: "Mail Error" };
        }
    }

    return { detail: "SERVER ERROR"}
}

export const ActionCreateNotProtected = async (data: unknown, schema: any, url: string, revalUrl?: string) => {

    var config = {}

    const result = schema.safeParse(data);
    if (!result.success) {
        let errorMessage: any = {};

        result.error.issues.forEach((issue: any) => {
            errorMessage[issue.path[0]] = issue.message;
        });

        return { error: errorMessage }
    }

    var response = null
    if (url.includes("token")){
        response = await axiosRequest<any>({
            method: "post",
            url: url,
            payload: { ...result.data },
            params: "remove_payload",
            token: config
        })
    } else {
        response = await axiosRequest<any>({
            method: "post",
            url: url,
            payload: result.data,
            params: "remove_payload",
            token: config
        })
    }

    if (response) {
        if (response.data) {
            return response.data
        }
        if (response?.data.errors) {
            return { errors: response.data.errors };
        }
        if (response?.data.error?.toString().includes("[WinError]")) {
            return { Error: "Mail Error" };
        }
    }

    return { detail: "SERVER ERROR"}
}


export const ActionEdit = async (data: unknown, id: string | number, schema: any, url: string, domain: string) => {
    
    const api = await useAxios(domain);

    const session = await getSession()
    var config = {}
    if (session.access && session.access.length > 10) {
        config = { headers: { Authorization: `Bearer ${session.access}`}}
    }
    var updated_by_id = null
    if (session){
        var t: JwtPayload = jwtDecode(session.access)
        updated_by_id = t.user_id
    }

    const result = schema.safeParse(data);

    if (!result.success) {
        let errorMessage: any = {};

        result.error.issues.forEach((issue: any) => {
            errorMessage[issue.path[0]] = issue.message;
        });

        return {
            error: errorMessage
        }
    }

    const response = await api.put(
        url + "/" + id,
        { ...result.data, updated_by_id: updated_by_id },
    )

    if (response) {
        if (response?.data.errors) {
            return { errors: response.data.errors };
        }
        if (response.data) {
            return response.data
        }
    }

    return { detail: "SERVER ERROR"}

}


export const ActionDelete = async (url:string, id: number | string) => {
    const session = await getSession()
    var config = {}
    if (session.access && session.access.length > 10) {
        config = { headers: { Authorization: `Bearer ${session.access}`}}
    }

    const response = await axiosRequest<any>({
        method: "delete",
        url: url  + "/" + id,
        params: "remove_payload",
        token: config
    })

    if (response?.data.error) {
        if (response.data.error.includes("Cannot delete")){ return { error: "Cannot Delete This Level" } }
        return { error: response.data.error}
    }
    if (response.data == '') {
        return { success: "DELETED" }
    }
    if (response.data) {
        return { error: response.data }
    }
   

    return { detail: "SERVER ERROR"}
}


export const makeMobilePayment = async (formData: any, apiSchoolFee: GetSchoolFeesInter | any) => {
    const newData = {
        schoolfees_id: apiSchoolFee?.id,
        telephone: formData.get("telephone"),
        operator: formData.get("operator"),
        payment_method: formData.get("operator"),
        amount: apiSchoolFee?.platform_charges,
        reason: "PLATFORM CHARGES",
        status: "completed",
    }
    var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: newData.amount, service: newData.operator, payer: newData.telephone });
    return pay
}

