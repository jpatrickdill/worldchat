import {v4 as uuidv4} from "uuid";
import React, {createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState} from "react";
import clsx from "clsx";
import {ClipLoader} from "react-spinners";
import {useMap, useSet} from "../utils/hooks";


interface IAlert {
    id: string,
    content?: ReactNode,  // Content to display, can be string or custom children
    timestamp: Date,  // Timestamp used to order alerts. If not specified, new Date() is used

    // Optional duration (ms). If specified, alert will disappear after this time.
    // Changing alert props will not cause alert to re-appear after duration.
    duration?: number,

    // if <Alert> is removed from tree before minDuration, it will remain in the alerts list until
    // minDuration has passed
    minDuration?: number,


    canClose?: boolean // Whether the alert can be closed by the user. Defaults to true

    // Called when a user closes the alert. This isn't called when the alert closes by other means.
    onClose?: (() => void) | (() => Promise<void>)

    loading?: boolean, // Includes a spinner on the left side of the alert
    err?: boolean // Specifies the alert as an error message or warning - "!" icon included in alert box.

    // Classname used for the div that parents "children". This does not affect the alert container.
    className?: string,
}


// actual alert box component that gets rendered in overlay

function AlertBox({children, alert, onClose}: {
    children?: ReactNode, alert: IAlert, onClose: () => void
}) {
    const [hover, setHover] = useState(false);
    // const [animateClose, setAnimateClose] = useState(false);

    const closeCb = () => {
        onClose();

        if (alert.onClose) {
            Promise.resolve(alert.onClose()).then();
        }
    }

    return <div
        className={clsx(
            "rounded-lg overflow-hidden transition-transform",
            "bg-gray-800/75 text-copy-white",
            "flex items-stretch",
        )}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        // style={{
        //     transform: animateClose ? "scale(1, 0)" : "scale(1, 1)"
        // }}
    >
        <div className={clsx(
            "px-4 py-3 flex gap-3 items-center",
            "flex-grow"
        )}>
            {alert.loading && !alert.err ? <div className="self-stretch flex items-center">
                <ClipLoader
                    color="white" size={20}
                    speedMultiplier={0.75}
                />
            </div> : null}

            {alert.err ? <>
                <i className="fa fa-circle-exclamation text-xl "/>
            </> : null}

            <div className={alert.className}>
                {children}
            </div>
        </div>

        {alert.canClose ? <button
            className={clsx(
                "w-10 flex-none border-l border-gray-400",
                "transition-[background-color] hover:bg-copy-gray",
                {"opacity-0": !hover}
            )}
            onClick={closeCb}
        >
            <i className="fa fa-times"/>
        </button> : null}
    </div>
}


const AlertsCtx = createContext<{
    pushAlert: (val: Partial<IAlert> | string) => string,
    closeAlert: (id: string, alert?: IAlert) => void,
}>(undefined!);

// Place this in the top level of your app
export function AlertsProvider({children}: { children: ReactNode }) {
    const [alerts, alertsActions] = useMap<string, IAlert>();
    const hiddenAlerts = useSet<string>();

    const closeAlert = (id: string, alert?: IAlert) => {
        // bug: when this gets called from the <Alert> component useEffect() for cleanup,
        // it uses alerts state from before the alert was added, meaning we can't
        // get the alert's options such as minDuration
        alert ??= alerts.get(id);

        if (alert?.minDuration) {
            // check if minDuration has passed already.
            let timePassed = new Date().valueOf() - alert.timestamp.valueOf()
            if (timePassed < alert.minDuration) {
                setTimeout(() => {
                    alertsActions.delete(id);
                }, alert.minDuration - timePassed);
            } else {
                alertsActions.delete(id);
            }
        } else {
            alertsActions.delete(id);
        }

        // if this is being called by the Alert component, it means the alert is finished;
        // if the same alert ID gets pushed again it should get re-rendered (even if user has closed it).
        // therefor we remove it from the set of hiddenAlerts
        hiddenAlerts.delete(id);
    };

    const pushAlert = (alertOptions: Partial<IAlert> | string) => {
        if (typeof alertOptions === "string") {
            alertOptions = {
                content: alertOptions
            }
        }

        const alert: IAlert = {
            id: uuidv4(),  // default ID if one wasn't included
            timestamp: new Date(),  // default timestamp
            canClose: true,  // default canClose
            ...alertOptions
        }

        let {id} = alert;

        // <Alert> components are unaware if the alert has been closed, and may push
        // prop changes even after the alert is closed. We don't want to reintroduce those,
        // so we keep a list of closed alerts that are still in the React tree.
        if (hiddenAlerts.has(id)) return id;

        alertsActions.set(id, alert);
        if (!alerts.get(id) && alert.duration) {
            // if this is a new alert, and there's a duration, create the timer to close the alert

            setTimeout(() => {
                alertsActions.delete(id);
            }, alert.duration);
        }

        return id;
    };


    const alertsList = Array.from(alerts.values());

    alertsList.sort((a, b) => {
        let dfDate = new Date(0);
        return (a.timestamp ?? dfDate).valueOf() - (b.timestamp ?? dfDate).valueOf();
    })

    // console.log(alertsList);

    const ctxVal = useMemo(() => (
        {pushAlert, closeAlert}
    ), [
        hiddenAlerts.size,
        alerts
    ]);

    return <AlertsCtx.Provider value={ctxVal}>
        {children}

        {/* alerts list overlay */}
        <div className={clsx(
            "fixed z-50 top-0 right-0 overflow-hidden",
            "w-full lg:w-96 p-2",
            "flex flex-col gap-2"
        )}>
            {alertsList.map((alert) => <AlertBox
                key={alert.id} alert={alert}
                onClose={() => {
                    alertsActions.delete(alert.id);

                    // push to the hidden alerts set to prevent prop changes from causing re-renders
                    hiddenAlerts.add(alert.id);
                }}
            >
                {alert.content}
            </AlertBox>)}
        </div>
    </AlertsCtx.Provider>
}

export const useAlerts = () => useContext(AlertsCtx);

type AlertProps = Partial<IAlert> & {
    children?: ReactNode, // Alert content

    // if true, alert will remain even after the <Alert> component is removed from the React tree.
    // alert will persist until user closes it, or until `duration` is reached.
    persist?: boolean,
}


export const Alert = (props: AlertProps) => {
    /*
        Alert component used to push content to Alerts context.

        This component being in the tree doesn't always mean an alert is being rendered.
        Instead of this component representing the actual alerts list state, it is used as a proxy
        to the pushAlert() and closeAlert() functions to provide a more natural way of rendering alerts.
     */

    const {pushAlert, closeAlert} = useAlerts();

    // generate default ID inside the component, so context can track changes to props
    // instead of creating new alerts
    const [defaultId] = useState(uuidv4());
    const [defaultTimestamp] = useState<Date>(new Date());

    // transform AlertProps object to IAlert type that context will use
    let alert = {
        id: defaultId,
        timestamp: defaultTimestamp,
        content: props.children,

        // overwrite defaults with anything passed directly (timestamp, id, content)
        ...props
    }
    delete alert.children;

    useEffect(() => {
        pushAlert(alert);
    }, [
        alert.id, alert.timestamp, alert.canClose, alert.err,
        alert.persist, alert.loading, alert.content, alert.minDuration
    ]);

    // remove alert when component is removed from tree
    useEffect(() => {
        return () => {
            if (alert.persist) return;

            closeAlert(alert.id, alert);
        }
    }, [  // the stuff that matters for cleanup
        alert.id, alert.minDuration, alert.timestamp, alert.persist
    ]);

    return null;
}