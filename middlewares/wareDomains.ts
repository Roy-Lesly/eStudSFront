import { Subdomains } from "@/dataSource";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export function withMiddlewareDomains(middleware: NextMiddleware){
    return async (request: NextRequest, event: NextFetchEvent) => {
        const url = request.nextUrl
        const hostname = request.headers.get("host");
        const subdomain = hostname ? hostname.split('.')[0] : "";
        let subdomainData = Subdomains.find(d => d.subdomain === subdomain);
        if (!subdomainData){ subdomainData = { id: 1, subdomain: "test" }}
        var modifiedRequest = request

        if (subdomainData && subdomain) {
            if (hostname?.startsWith(subdomain)){
                const exist = url.pathname.match(subdomainData.subdomain)
                if (!exist){
                    const newUrl = new URL(`/${subdomainData.subdomain}${url.pathname}`, request.url);
                    modifiedRequest = new NextRequest(newUrl, request)
                }
                
            }

        }

        return middleware(modifiedRequest, event)
    }
}