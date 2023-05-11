import clsx from "clsx";
import {ReactNode, useLayoutEffect} from "react";
import {useLayout} from "@/layout/Layout";
import {buttonCls} from "@/styles";


export function TopBar({className, children, outerCls, innerCls}: {
    className?: string, children?: ReactNode, outerCls?: string, innerCls?: string
}) {
    const {onMenu, isMobile} = useLayout();

    return <div className={clsx(
        "w-full flex-none select-none",
        "border-b border-background-accent shadow-sm",
        "flex items-stretch",
        className, outerCls,
        {"relative justify-center py-3": isMobile},
        {"h-14": !isMobile}
    )}>
        {isMobile ? <button
            className={clsx(
                "absolute top-0 left-0 w-16 h-full"
            )}
            onClick={onMenu}
        >
            <i className="fa fa-angle-left"/>
        </button> : null}

        <div className={clsx(
            "px-3 flex items-center text-lg",
            {"pl-0": isMobile},
            innerCls
        )}>
            {children}
        </div>

        {/*{isMobile ? <button*/}
        {/*    className={clsx("px-5 text-copy-dark opacity-0")}*/}
        {/*>*/}
        {/*    <i className="fa fa-user-circle"/>*/}
        {/*</button> : null}*/}
    </div>
}
