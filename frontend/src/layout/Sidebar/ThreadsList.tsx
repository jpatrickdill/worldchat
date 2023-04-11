import {useThreads} from "@/contexts/ThreadsContext";
import clsx from "clsx";
import React from "react";
import {Link, useParams} from "react-router-dom";
import {buttonCls} from "@/styles";
import {getMembersList} from "@/utils/misc";
import {useUser} from "@/contexts/UserContext";

export default function ThreadsList() {
    const {threads} = useThreads();
    const {threadId} = useParams();
    const {user} = useUser();

    return <div className={clsx(
        "w-full h-full p-2",
        "flex flex-col gap-1 overflow-y-scroll"
    )}>
        {threads.map(thread => {
            const threadDisplayName = thread.members.length > 1 ? getMembersList(thread, [user?.uid], 3) : undefined;

            return <div
                key={thread.id}
            >
                <Link
                    className={clsx(
                        buttonCls, "text-sm hover:bg-gray-300/50",
                        {"bg-gray-300/50": thread.id === threadId},
                        "relative flex gap-2 items-center"
                    )}
                    to={`/t/${thread.id}`}
                >
                    <i className="fa fa-comments"/>
                    <span>{threadDisplayName || thread.name?.content}</span>

                    {thread.id === threadId ? <div
                        className="absolute top-0 left-0 w-1 h-full bg-blue-500"
                    /> : null}
                </Link>
            </div>
        })}
    </div>
}