import i18nConfig from '@/*';
import { i18nRouter } from 'next-i18n-router';
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";



export function withMiddlewareInter(middleware: NextMiddleware){
    return async (request: NextRequest, event: NextFetchEvent) => {
        const url = request.url
        return i18nRouter(request, i18nConfig);
    }
}