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
            const session = await getIronSession<SessionInter>(cookies(), sessionOptions)
            var token: any = null
            if (session) {
                if (session.access) { token = jwtDecode(session.access) }
            }
            for (let index = 0; index < protected_paths.length; index++) {
                const element = protected_paths[index];
                // console.log("current Protected path:", current_path, element, "line-23")
                if (current_path.includes(element)) {
                    // console.log("line 25", index)
                    if (token == null) {
                        // console.log("PROTECTED but No token ==================================")
                        // return NextResponse.redirect(new URL("/pageAuthentication/pageNotLoggedIn", request.url))
                    }
                    if (token) {
                        if (new Date().toISOString().toString().slice(0, 16) > new Date(token.exp * 1000).toISOString().slice(0, 16)) {
                            // console.log("PROTECTED but Expired ==================================")
                            // return NextResponse.redirect(new URL("/pageAuthentication/pageSessionExpired", request.url))
                        }
                        // console.log("PROTECTED Token OK ==================================")
                    }
                    break;
                }
            }
        }

        return middleware(request, event)
    }
}