"use server";
import { protocol } from '@/config';
import { axiosRequest } from '@/functions';
import { CustomUserUrl } from '@/Domain/Utils-H/userControl/userConfig';

export const DeleteActionCustomUser = async (id: string) => {

    const response = await axiosRequest<any>({
        method: "delete",
        url: protocol + CustomUserUrl + "/" + id,
    })

    if (response.data) {
        return response.data
    }

    return { detail: "SERVER ERROR"}


}