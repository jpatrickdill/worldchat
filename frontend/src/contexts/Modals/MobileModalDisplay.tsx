import {ModalProps} from "@/contexts/Modals/ModalContext";
import React, {MouseEvent, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {T} from "@/contexts/TransContext";

export function MobileModalDisplay(props: ModalProps & { transitionDuration: number, top: number }) {
    const [offScreen, setOffScreen] = useState(true);

    useEffect(() => {
        // animate in on first render
        if (!props.animateOut) {
            setOffScreen(false);
        } else {
            setOffScreen(true);
        }
    }, [props.animateOut]);

    const {children, enabled, onClose} = props;
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
    }, [onClose]);

    const [isScrolled, setIsScrolled] = useState(false);

    const onScroll = () => {
        if (!contentRef.current) return;

        setIsScrolled(contentRef.current.scrollTop > 0);
    }

    if (!enabled) {
        return null;
    }

    return <div
        className={clsx(
            "fixed w-screen h-mobile top-0 left-0 overflow-y-scroll",
            "z-40 text-copy"
        )}
        onClick={e => e.stopPropagation()}
        onScroll={e => e.stopPropagation()}
        style={{
            transitionProperty: "transform",
            transitionDuration: `${props.transitionDuration}ms`,
            transform: `translateY(${offScreen ? "100%" : "0"})`,
            paddingTop: `${props.top}px`
        }}
    >
        {/* top bar with "Done" button */}
        <div
            className={clsx(
                `absolute top-${props.top} left-0 w-full h-14 z-50`,
                "px-5 flex gap-2 items-center justify-between",
                "rounded-t-2xl border-t border-border",
                {"bg-background border-b": isScrolled || props.title}
            )}
        >
            <span className="opacity-0">{props.buttonEl ?? "Done"}</span>
            <h1 className="font-semibold text-md">
                <T>{props.title}</T>
            </h1>

            <button
                className="font-semibold text-primary text-md"
                onClick={props.onClose}
            >
                <T>{props.buttonEl ?? "Done"}</T>
            </button>
        </div>

        <div
            className={clsx(
                "w-full h-full overflow-y-scroll",
                "bg-background rounded-t-2xl",
                "relative pt-14 pb-4"
            )} ref={contentRef}
            onScroll={onScroll}
            onDrag={onScroll}
        >

            <div className={props.className}>
                {children}
            </div>
        </div>
    </div>
}