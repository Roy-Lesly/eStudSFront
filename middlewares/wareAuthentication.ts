import { SessionInter, sessionOptions } from "@/serverActions/interfaces";
import { getIronSession } from "iron-session";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";



export function withMiddlewareAuth(middleware: NextMiddleware) {
    return async (request: NextRequest, event: NextFetchEvent) => {
        const url = request.url
        const current_path = request.nextUrl.pathname
        const protected_paths: string[] = ["Section", "SelectSchool"]
        if (current_path) {
            const session = await getIronSession<SessionInter>(await cookies(), sessionOptions)
            var token: any = null
            if (session) {
                if (session.access) { token = jwtDecode(session.access) }
            }
            for (let index = 0; index < protected_paths.length; index++) {
                const element = protected_paths[index];
                if (current_path.includes(element)) {
                    if (token == null) {
                        // return NextResponse.redirect(new URL("/pageAuthentication/pageNotLoggedIn", request.url))
                    }
                    if (token) {
                        if (new Date().toISOString().toString().slice(0, 16) > new Date(token.exp * 1000).toISOString().slice(0, 16)) {
                            // return NextResponse.redirect(new URL("/pageAuthentication/pageSessionExpired", request.url))
                        }
                    }
                    break;
                }
            }
        }

        return middleware(request, event)
    }
}