import { Subdomains } from "@/dataSource";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export function withMiddlewareDomains(middleware: NextMiddleware){
    return async (request: NextRequest, event: NextFetchEvent) => {
        const url = request.nextUrl
        // if (url.pathname.startsWith('/favicon.ico') || url.pathname.startsWith('/_next/')) {
        if (url.pathname.startsWith('/favicon.ico')) {
            return middleware(request, event);
        }
        const hostname = request.headers.get("host");
        const subdomain = hostname ? hostname.split('.')[0] : "";

        const subdomainData = Subdomains.find(d => d.subdomain === subdomain);

        var modifiedRequest = request

        if (subdomainData && subdomain) {
            if (hostname?.startsWith(subdomain)){
                const exist = url.pathname.match(subdomainData.subdomain)
                if (!exist){
                    const newUrl = new URL(`/${subdomain}${url.pathname}`, request.url);
                    modifiedRequest = new NextRequest(newUrl, request)
                }
                
            }

        }

        return middleware(modifiedRequest, event)
    }
}