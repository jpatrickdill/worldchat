import React, {MouseEvent, ReactNode, useEffect, useRef} from "react";
import clsx from "clsx";

export default function Modal({children, className, bgCls, showing, onClose}: {
    children?: ReactNode,
    className?: string,
    bgCls?: string,
    showing?: boolean,
    onClose?: () => void
}) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent<HTMLElement>) => {
            // @ts-ignore
            if (contentRef.current && !contentRef.current.contains(e.target)) {
                if (onClose) onClose();
            }
        };

        // @ts-ignore
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            // @ts-ignore
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [ onClose ]);

    if (!showing) {
        return null;
    }

    return <div
        className={clsx(
            "fixed w-screen h-screen top-0 left-0 overflow-auto flex justify-center items-center",
            "z-10 bg-gray-600/50 backdrop-blur-lg", bgCls
        )}
    >
        <div className={clsx(className)} ref={contentRef}>
            {children}
        </div>
    </div>
}