import {TopBar} from "@/layout/TopBar";
import React from "react";
import PageContent from "@/layout/PageContent";
import LanguageSettings from "@/pages/Settings/LanguageSettings";
import {T} from "@/contexts/TransContext";
import AccountSettings from "@/pages/Settings/AccountSettings";
import {Route, Routes, useLocation} from "react-router";
import {Link} from "react-router-dom";
import clsx from "clsx";
import {useLayout} from "@/layout/Layout";
import ThemeSettings from "@/pages/Settings/Theme/ThemeSettings";


const menus = [
    {
        label: "Account",
        route: "account",
        element: <AccountSettings/>
    },
    {
        label: "Language",
        route: "language",
        element: <LanguageSettings/>
    },
    {
        label: "Theme",
        route: "theme",
        element: <ThemeSettings/>
    }
]

function SettingsMenu() {
    const {pathname} = useLocation();

    return <div className="w-full h-full flex flex-col">
        {menus.map(({label, route, element}) => {
            const isCurrent = pathname.endsWith("/" + route);

            return <Link
                to={route}
                className={clsx(
                    "pl-3 pr-5 py-3 flex gap-2 justify-between items-center hover:bg-background-accent",
                    "text-copy-dark relative",
                    {"bg-background-accent": isCurrent}
                )}
            >
                <T>{label}</T>

                <i className="fa fa-angle-right"/>

                {isCurrent ? <div
                    className="bg-primary absolute h-full w-1 top-0 left-0"
                /> : null}
            </Link>
        })}
    </div>
}

export default function Settings() {
    const {isMobile} = useLayout();
    const lastSeg = useLocation().pathname.split("/").at(-1);
    const currentMenu = menus.find(menu => menu.route === lastSeg);

    return <>
        <TopBar innerCls="gap-2">
            <T>
                Settings
            </T>
            {currentMenu ? <>
                <span> - </span>
                <T>{currentMenu.label}</T>
            </> : null}
        </TopBar>
        <PageContent>
            <div className={clsx(
                "h-full grid items-stretch",
                {"grid-cols-1": isMobile},
                {"grid-cols-2 lg:grid-cols-3": !isMobile}
            )}>
                {(!isMobile || !currentMenu) ? <div
                    className="h-full border-r border-border"
                >
                    <SettingsMenu/>
                </div> : null}

                <div className="col-span-1 lg:col-span-2 p-2 md:p-3">
                    <Routes>
                        {menus.map(({route, element}) => <Route
                            path={route}
                            element={element}
                        />)}
                    </Routes>
                </div>
            </div>
        </PageContent>
    </>
}