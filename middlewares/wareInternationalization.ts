import i18nConfig from '@/*';
import { i18nRouter } from 'next-i18n-router';
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";


export function withMiddlewareInter(middleware: NextMiddleware): NextMiddleware {
    return async (request: NextRequest, event: NextFetchEvent) => {
      const url = request.nextUrl;
        if (
            url.pathname.startsWith("/favicon.ico") ||
            url.pathname.startsWith("/_next/") ||
            url.pathname.startsWith("/static/")
        ) {
          return middleware(request, event);
        }

      const response = await middleware(request, event);
      return i18nRouter(request, i18nConfig) || response;
    };
  }

