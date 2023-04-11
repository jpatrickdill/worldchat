import {TopBar} from "@/layout/TopBar";
import PageContent from "@/layout/PageContent";
import {WithId} from "@/schemas/types";
import {ThreadWithMembers} from "@/contexts/ThreadsContext";
import {getMembersList} from "@/utils/misc";
import React from "react";
import {T} from "@/contexts/TransContext";
import {useUser} from "@/contexts/UserContext";
import clsx from "clsx";
import NewMessage from "@/pages/Thread/NewMessage";
import UserList from "@/pages/Thread/UserList";
import MessageList from "@/pages/Thread/MessageList";

export default function ThreadContainer({thread}: { thread: WithId<ThreadWithMembers> }) {
    const {user} = useUser();

    const threadDisplayName = thread.members.length > 1 ? getMembersList(thread, [user?.uid]) : undefined;

    return <>
        <TopBar>
            {threadDisplayName ? <div>
                <T>Chat with</T>
                <span> {threadDisplayName}</span>
            </div> : <T>
                {thread.name?.content}
            </T>}
        </TopBar>
        <PageContent className="p-0 flex items-stretch">
            <div className={clsx(
                "flex-grow h-full",
                "flex flex-col gap-2"
            )}>
                <div className="w-full h-full overflow-y-scroll">
                    <MessageList thread={thread}/>
                </div>
                <NewMessage thread={thread}/>
            </div>
            <div className={clsx(
                "flex-none hidden md:block w-48 lg:w-64",
                "border-l border-gray-200",
                "h-full overflow-y-scroll"
            )}>
                <UserList thread={thread}/>
            </div>
        </PageContent>
    </>
}