import { RootApi } from "@/config"

export const LoginUrl = RootApi + "/token/" 
export const RefreshTokenUrl = RootApi + "/token/refresh/"
export const ResetPasswordTokensUrl = RootApi + "/admin/django_rest_passwordreset/resetpasswordtoken/"
export const ResetPasswordEmail = RootApi + "/password_reset/"
