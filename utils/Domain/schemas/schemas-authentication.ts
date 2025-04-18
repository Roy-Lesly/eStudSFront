import { z } from "zod";


export const SchemaRefresh = z.object({
    refresh: z.string().trim().min(20, { message: "Must Contain 20 Characters Minimum"}),
})

export const SchemaLogin = z.object({
    matricle: z.string().trim().min(1, { message: "Must Contain 1 Characters Minimum"}),
    password: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"})
})


export const SchemaCheckUser = z.object({
    matricle: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"})
})


export const SchemaCreatePassword = z.object({
    password: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"}),
    confirm_password: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"})
})


export const SchemaResetPassword = z.object({
    email: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"})
})


export const SchemaConfirmResetPassword = z.object({
    token: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"}),
    password: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum"})
})



