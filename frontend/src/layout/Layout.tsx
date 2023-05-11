import clsx from "clsx";
import {Outlet, useLocation, useNavigate} from "react-router";

import NavMenu from "./NavMenu";
import {createContext, useContext, useEffect, useMemo, useState} from "react";

const LayoutContext = createContext<{
    onMenu: () => void,
    ios: boolean,
    isMobile: boolean
}>({
    onMenu: () => {},
    ios: true,
    isMobile: true
});

export default function Layout() {
    const [sidebar, setSidebar] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();

    const navigate = useNavigate();

    const ios = useMemo(() => {
        return [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod'
            ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }, []);

    useEffect(() => {
        setSidebar(false);
    }, [location.pathname]);

    const onMenu = () => navigate(-1);

    useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth <= 768);
        }

        window.addEventListener('resize', onResize);
        onResize();

        return () => window.removeEventListener('resize', onResize);
    }, [window])

    return <LayoutContext.Provider value={{onMenu, isMobile, ios}}>
        <div className={clsx(
            "w-full h-full fixed top-0 left-0",
            "flex relative"
        )}>
            <div
                className={clsx(
                    {"w-full h-full flex-none absolute top-0 left-0 z-30": isMobile},
                    {"w-72 flex-none block static": !isMobile},
                    {"hidden": isMobile && !sidebar},
                )}
            >
                {!isMobile ? <NavMenu
                    className="w-full max-w-none"
                /> : null}
            </div>
            <div className={clsx(
                "flex-grow flex flex-col h-full",
                // {"hidden": window.innerWidth <= 640 && sidebar}
            )}>
                <Outlet/>
            </div>
        </div>
    </LayoutContext.Provider>
}

export const useLayout = () => useContext(LayoutContext)