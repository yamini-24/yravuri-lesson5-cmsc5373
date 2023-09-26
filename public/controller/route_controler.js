import { homePageView } from "../view/home_page.js"
import { MenuPageView } from "../view/menu2_page.js"
import { threadPageView } from "../view/thread_page.js";

export const routePathnames = {
    HOME: '/',
    THREAD: '/thread',
    MENU2: '/menu2',
}

export const routes = [
    {path: routePathnames.HOME, page: homePageView},
    {path: routePathnames.THREAD, page: threadPageView},
    {path: routePathnames.MENU2, page: MenuPageView}
];

export function routing(pathname, hash){
    const route = routes.find(r => r.path == pathname);
    if(route) {
        if(hash && hash.length > 1) {
            route.page(hash.substring(1));
        }else{
            route.page();
        }
    } else{
        routes[0].page();
    }
}