import clsx from "clsx";
import React, {useState} from "react";
import {useNavigate} from "react-router";

import {T} from "@/contexts/TransContext";
import {useApi} from "@/contexts/ApiContext";
import {buttonCls} from "@/styles";
import {Alert} from "@/contexts/AlertsContext";
import ThreadsList from "@/layout/NavMenu/ThreadsList";
import {Link} from "react-router-dom";
import WordMark from "@/components/WordMark";
import LoginModal from "@/pages/Login/LoginModal";
import {useUser} from "@/contexts/UserContext";
import {useLayout} from "@/layout/Layout";
import NavTop from "@/layout/NavMenu/NavTop";
import NavBottom from "@/layout/NavMenu/NavBottom";

export default function NavMenu({className}: { className?: string }) {
    return <>
        <div
            className={clsx(
                "w-full h-full",
                "md:border-r border-background-accent-darker",
                "bg-background md:bg-background-accent",
                "flex flex-col",
                className
            )}
            onClick={e => e.stopPropagation()}
        >
            <div className={clsx(
                "flex-grow w-full h-full overflow-y-scroll",
                "flex flex-col"
            )}>
                <NavTop/>

                <ThreadsList/>

                <NavBottom/>
            </div>
        </div>
    </>
}