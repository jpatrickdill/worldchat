import clsx from "clsx";
import React, {useState} from "react";
import {T} from "../../contexts/TransContext";
import {useNavigate} from "react-router";
import {useApi} from "../../contexts/ApiContext";
import {buttonCls} from "../../styles";

export default function Sidebar() {
    const navigate = useNavigate();
    const api = useApi();

    const [loading, setLoading] = useState(false);

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
                try {
                    const threadId = await api.createThread();

                    navigate(`/t/${threadId}`);
                } catch (e) {
                    alert(e);
                }
                setLoading(false);
            }}
        >
            <i className="fa fa-plus text-sm"/>
            <span><T>New Chat</T></span>
        </button>
    </div>
}