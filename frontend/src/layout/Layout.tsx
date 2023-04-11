import clsx from "clsx";
import {Outlet} from "react-router";

import Sidebar from "./Sidebar";
import {useState} from "react";

export default function Layout() {
    const [sidebar, setSidebar] = useState(false);

    return <div className={clsx(
        "w-full h-full fixed top-0 left-0",
        "flex"
    )}>
        <div className={clsx(
            "lg:block w-56 lg:w-72 flex-none",
            {"hidden": !sidebar}
        )}>
            <Sidebar className="w-full"/>
        </div>
        <div className="flex-grow flex flex-col h-full">
            <Outlet/>
        </div>
    </div>
}