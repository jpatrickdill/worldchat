import {TopBar} from "@/layout/TopBar";
import PageContent from "@/layout/PageContent";
import {WithId} from "@/schemas/types";
import {LoadedThread} from "@/contexts/ThreadsContext";
import {getMembersList} from "@/utils/misc";
import React from "react";
import {T} from "@/contexts/TransContext";
import {useUser} from "@/contexts/UserContext";
import clsx from "clsx";
import NewMessage from "@/pages/Thread/NewMessage";
import UserList from "@/pages/Thread/UserList";
import MessageList from "@/pages/Thread/MessageList";

export default function ThreadContainer({thread}: { thread: WithId<LoadedThread> }) {
    const {user} = useUser();

    const threadDisplayName = thread.members.length > 1 ? getMembersList(thread, [user?.uid]) : undefined;

    return <>
        <TopBar>
            {threadDisplayName ? <div className="flex flex-col items-center text-copy">
                {/*<T>Chat with</T>*/}
                <i className="md:hidden fa fa-user-circle text-copy-dark text-4xl"/>

                <span className="text-sm md:text-lg">{threadDisplayName}</span>
            </div> : <T>
                Empty Chat
            </T>}
        </TopBar>
        <PageContent className="p-0 flex items-stretch">
            <div className={clsx(
                "flex-grow h-full",
                "flex flex-col gap-2"
            )}>
                <div className="w-full flex-grow overflow-hidden">
                    <MessageList thread={thread}/>
                </div>
                <NewMessage thread={thread}/>
            </div>
            <div className={clsx(
                "flex-none hidden md:block w-48 lg:w-64",
                "border-l border-border",
                "h-full overflow-y-scroll"
            )}>
                <UserList thread={thread}/>
            </div>
        </PageContent>
    </>
}