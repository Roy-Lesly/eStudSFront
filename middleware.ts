import { chain } from "./middlewares/chain";
import { withMiddlewareAuth } from "./middlewares/wareAuthentication";
import { withMiddlewareDomains } from "./middlewares/wareDomains";
import { withMiddlewareInter } from "./middlewares/wareInternationalization";


const middleware = [ withMiddlewareAuth, withMiddlewareDomains, withMiddlewareInter ]
// const middleware = [ withMiddlewareDomains, withMiddlewareInter ]
export default chain(middleware)

export const config = {
    matcher: [ "/((?!api|static|.*\\..*|_next/image|favicon.ico).*)" ]
}