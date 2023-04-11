import clsx from "clsx";
import {ReactNode} from "react";


export function TopBar({className, children, backButton, outerCls, innerCls}: {
    className?: string, children?: ReactNode, backButton?: boolean, outerCls?: string, innerCls?: string
}) {
    return <div className={clsx(
        "w-full h-14 flex-none",
        "border-b border-gray-100 shadow-sm",
        "flex gap-2 items-stretch",
        className, outerCls
    )}>
        <div className={clsx(
            "px-3 py-2 flex items-center text-lg",
            innerCls
        )}>
            {children}
        </div>
    </div>
}
