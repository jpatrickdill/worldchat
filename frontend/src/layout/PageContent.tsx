import {ReactNode} from "react";
import clsx from "clsx";

export default function PageContent({children, className}: {children?: ReactNode, className?: string}) {
    return <div className={clsx(
        "w-full h-full overflow-y-scroll",
        className
    )}>
        {children}
    </div>
}