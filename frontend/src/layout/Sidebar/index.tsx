import clsx from "clsx";
import React, {useState} from "react";
import {useNavigate} from "react-router";

import {T} from "@/contexts/TransContext";
import {useApi} from "@/contexts/ApiContext";
import {buttonCls} from "@/styles";
import {Alert} from "@/contexts/AlertsContext";
import ThreadsList from "@/layout/Sidebar/ThreadsList";
import {Link} from "react-router-dom";
import WordMark from "@/components/WordMark";

export default function Sidebar({className}: { className?: string }) {
    const navigate = useNavigate();
    const api = useApi();

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string>();

    return <div className={clsx(
        "w-full h-full",
        "bg-gray-100 border-r border-gray-200",
        "flex flex-col",
        className
    )}>
        <div className={clsx(
            "flex-grow w-full h-full overflow-y-scroll",
            "flex flex-col"
        )}>
            <div className="flex-none h-14 p-2 border-b border-gray-200 shadow-sm">
                <button
                    className={clsx(buttonCls, "py-1 w-full h-full text-sm  bg-gray-400/20")}
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        setErr(undefined);
                        try {
                            const threadId = await api.createThread("group");

                            navigate(`/t/${threadId}`);
                        } catch (e) {
                            setErr((e as Error).message);
                        }
                        setLoading(false);
                    }}
                >
                    <i className="fa fa-plus text-sm"/>
                    <span><T>New Chat</T></span>

                    {loading ? <Alert loading>
                        <T>Creating new thread...</T>
                    </Alert> : null}
                    {err ? <Alert err>
                        <span>Error: </span><T>{err}</T>
                    </Alert> : null}
                </button>
            </div>

            <ThreadsList/>

            <div className={clsx(
                "border-t-2 border-gray-200",
                "flex flex-col gap-2 p-2 pb-5"
            )}>
                <Link
                    className={buttonCls}
                    to="/settings"
                >
                    <i className="fa fa-cog"/>
                    <span> <T>Settings</T></span>
                </Link>

                <div className="flex justify-center">
                    <WordMark/>
                </div>
            </div>
        </div>
    </div>
}