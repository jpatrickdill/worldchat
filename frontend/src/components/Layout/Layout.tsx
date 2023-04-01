import clsx from "clsx";
import {Outlet} from "react-router";
import Sidebar from "./Sidebar";

export default function Layout() {
    return <div className={clsx(
        "w-full h-full",
        "flex"
    )}>
        <div className="w-72 flex-none">
            <Sidebar/>
        </div>
        <div className="flex-grow h-full overflow-scroll">
            <Outlet/>
        </div>
    </div>
}