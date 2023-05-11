import clsx from "clsx";
import {buttonCls} from "@/styles";
import {T} from "@/contexts/TransContext";
import {Alert} from "@/contexts/AlertsContext";
import React, {useState} from "react";
import {useUser} from "@/contexts/UserContext";
import {useLayout} from "@/layout/Layout";
import {useNavigate} from "react-router";
import {useApi} from "@/contexts/ApiContext";
import NewChat from "@/pages/NewChat/NewChat";

export default function NavTop() {
    const {user} = useUser();
    const {isMobile} = useLayout();

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string>();

    const [showNewChat, setShowNewChat] = useState(false);

    const navigate = useNavigate();
    const api = useApi();

    return <div className={clsx(
        "flex-none h-14 p-2",
        {"border-b border-background-accent-darker shadow-sm": !isMobile},
        "flex items-center justify-between gap-2 px-4"
    )}>
        <h1 className="text-2xl font-black md:font-bold">
            <T>Messages</T>
        </h1>

        <button
            className={clsx(
                "text-primary text-xl"
            )}
            disabled={loading}
            onClick={async () => {
                // setLoading(true);
                // setErr(undefined);
                // try {
                //     const threadId = await api.createThread("group");
                //
                //     navigate(`/t/${threadId}`);
                // } catch (e) {
                //     setErr((e as Error).message);
                // }
                // setLoading(false);

                setShowNewChat(true);
            }}
        >
            <i className="fa fa-pen-to-square text-md"/>

            {loading ? <Alert loading>
                <T>Creating new thread...</T>
            </Alert> : null}
            {err ? <Alert err>
                <span>Error: </span><T>{err}</T>
            </Alert> : null}
        </button>

        <NewChat enabled={showNewChat} onClose={() => setShowNewChat(false)}/>
    </div>
}