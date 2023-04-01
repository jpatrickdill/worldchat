import clsx from "clsx";
import React, {useState} from "react";
import {T} from "../../contexts/TransContext";
import {useNavigate} from "react-router";
import {useApi} from "../../contexts/ApiContext";
import {buttonCls} from "../../styles";
import {Alert, useAlerts} from "../../contexts/AlertsContext";

export default function Sidebar() {
    const navigate = useNavigate();
    const api = useApi();

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string>();

    return <div className={clsx(
        "w-full h-full",
        "bg-gray-100 border-r border-gray-200",
        "p-2 flex flex-col gap-2"
    )}>
        <button
            className={buttonCls}
            disabled={loading}
            onClick={async () => {
                setLoading(true);
                setErr(undefined);
                try {
                    const threadId = await api.createThread("group");

                    setErr(undefined);
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
}