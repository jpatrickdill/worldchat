import React, {createContext, ReactNode, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import useMap from "@/utils/hooks";
import {useLayout} from "@/layout/Layout";
import clsx from "clsx";
import Helmet from "react-helmet";
import {MobileModalDisplay} from "@/contexts/Modals/MobileModalDisplay";
import {DesktopModalDisplay} from "@/contexts/Modals/DesktopModalDisplay";

const DURATION = 500;
const SCALE_FACTOR = 0.1;
const TOP_DIST = window.innerHeight * SCALE_FACTOR / 2;

export interface ModalProps {
    title?: string,
    children?: ReactNode,
    onClose?: () => void,
    enabled?: boolean,
    depth?: number,
    animateOut?: boolean,
    className?: string,
    buttonEl?: ReactNode,
    size?: "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl",
}

interface ModalContextT {
    registerModal: (id: string, props: ModalProps) => void;
    removeModal: (id: string) => void;
}

const modalsContext = createContext<ModalContextT>(undefined!);

export function ModalsProvider({children}: { children?: ReactNode }) {
    const [modals, {set: setModal, delete: deleteModal}] = useMap<string, ModalProps>();
    const isMobile = window.innerWidth <= 768;
    const [initial, setInitial] = useState(true);

    const contentRef = useRef<HTMLDivElement>(null);

    const registerModal = (id: string, props: ModalProps) => {
        setModal(id, props);
    }

    const removeModal = (id: string) => {
        setModal(id, {
            ...modals.get(id),
            animateOut: true
        });

        // only fully remove modal after it's done animating out
        setTimeout(() => {
            deleteModal(id);
        }, isMobile ? DURATION : 0);
    }

    // current background color based on theme
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--c-background');

    // modals that aren't current showing (doesn't include modals being animated out)
    const modalShowing = Array.from(modals.values()).filter(m => !m.animateOut).length > 0;

    // only do scale animations if on mobile
    const isScaled = isMobile && modalShowing;

    // theme color uses state so we can delay it for animations
    const [themeColor, setThemeColor] = useState(bgColor);

    // handle background color changes so that theme updates when bg color is changed
    useEffect(() => {
        const el = document.documentElement;

        if (isScaled) {
            el.style.setProperty("--modalsbg", "#000000");
        } else {
            el.style.setProperty("--modalsbg", bgColor);
            setThemeColor(bgColor);
        }
    }, [bgColor]);

    useEffect(() => {
        (document.activeElement as HTMLElement)?.blur();
        const el = document.documentElement;

        if (isScaled) {
            el.style.setProperty("--modalsbg", "#000000");
            setThemeColor("#000000");
        } else {
            if (!initial) {
                const timerId = setTimeout(() => {
                    // reset colors after animations are done

                    el.style.setProperty("--modalsbg", bgColor);
                    setThemeColor(bgColor);
                }, isMobile ? DURATION : 0);

                return () => {
                    clearTimeout(timerId);
                }
            } else {
                setInitial(false);
            }
        }
    }, [modalShowing]);

    const ModalComponent = isMobile ? MobileModalDisplay : DesktopModalDisplay;

    return <modalsContext.Provider value={{registerModal, removeModal}}>
        <>
            <Helmet>
                <meta name="theme-color" content={themeColor}/>
            </Helmet>

            <div
                className={clsx(
                    "absolute top-0 left-0 w-screen h-mobile text-copy bg-background overflow-hidden",
                )}
                ref={contentRef}
                style={{
                    transform: isScaled ? `scale(${1 - SCALE_FACTOR})` : "scale(1)",
                    borderRadius: isScaled ? "1em" : "0",
                    transitionProperty: "transform, border-radius" + (isMobile ? ", filter" : ""),
                    transitionDuration: `${DURATION}ms`,
                    filter: modalShowing ? "brightness(0.8)" : ""
                }}
            >
                {children}
            </div>

            {/* modals */}
            {Array.from(modals.values()).map(modal => <ModalComponent
                {...modal} top={TOP_DIST + 16}
                transitionDuration={DURATION}
            />)}
        </>
    </modalsContext.Provider>
}

export const useModals = () => useContext(modalsContext);