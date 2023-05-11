import React, {MouseEvent, ReactNode, useEffect, useRef} from "react";
import clsx from "clsx";

export default function OldModal({children, className, bgCls, showing, onClose}: {
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
            "fixed w-screen h-screen top-0 left-0 overflow-auto",
            "z-50 backdrop-blur-sm ", bgCls
        )}
        onClick={e => e.stopPropagation()}
        onScroll={e => e.stopPropagation()}
    >
        <div className="w-full h-full flex justify-center items-center px-2 pt-5 overflow-scroll">
            <div className={clsx(
                "bg-background rounded-2xl lg:rounded-xl overflow-hidden border-2 border-border shadow-lg",
                "px-3 py-5 lg:px-5",
                className
            )} ref={contentRef}>
                {children}
            </div>
        </div>
    </div>
}