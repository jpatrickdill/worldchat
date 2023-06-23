import {TopBar} from "@/layout/TopBar";
import PageContent from "@/layout/PageContent";
import {WithId} from "@/schemas/types";
import {LoadedThread} from "@/contexts/ThreadsContext";
import {getMembersList} from "@/utils/misc";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {T} from "@/contexts/TransContext";
import {useUser} from "@/contexts/UserContext";
import clsx from "clsx";
import NewMessage from "@/pages/Thread/NewMessage";
import UserList from "@/pages/Thread/UserList";
import MessageList from "@/pages/Thread/MessageList";
import {LanguageType} from "@/schemas/langauge";

export default function ThreadContainer({thread}: { thread: WithId<LoadedThread> }) {
    const {user, langConfig} = useUser();
    const threadDisplayName = thread.members.length > 1 ? getMembersList(thread, [user?.uid]) : undefined;

    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>();

    useEffect(() => {
        setCurrentLanguage(langConfig?.language);
    }, [langConfig]);

    const allLanguages = useMemo(() => {
        return Object.values(thread.membersMap).reduce<LanguageType[]>((acc, cur) => {
            if (cur?.config?.language) {
                let thisLang = cur.config.language;

                if (!acc.find(lang => thisLang.code === lang.code && thisLang.region === lang.region)) {
                    acc.push(thisLang);
                }
            }

            return acc;
        }, [])
    }, [thread.members]);

    return <>
        <TopBar>
            {threadDisplayName ? <div className="flex flex-col items-center text-copy">
                {/*<T>Chat with</T>*/}
                <i className="md:hidden fa fa-user-circle text-copy-dark text-4xl"/>

                <span className="text-sm md:text-lg">{threadDisplayName}</span>
            </div> : <T>
                Empty Chat
            </T>}

            <div className="flex-grow"/>

            <button
                className={clsx(
                    "absolute top-0 right-0 w-24 h-full"
                )}
            >
                <i className="fas fa-globe text-lg text-copy-dark"/>

                <select
                    className="opacity-0 appearance-none absolute top-0 right-0 w-full h-full"
                    value={JSON.stringify(currentLanguage)}
                    onChange={(e) => {
                        let newLang = JSON.parse(e.target.value);
                        setCurrentLanguage(newLang);
                    }}
                >
                    {allLanguages.map(lang => <option
                        key={lang.code + lang.region}
                        value={JSON.stringify(lang)}
                    >
                        {lang.name}{lang.region ? ` (${lang.region})` : ""}
                    </option>)}
                </select>
            </button>
        </TopBar>
        <PageContent className="p-0 flex items-stretch">
            <div className={clsx(
                "flex-grow h-full",
                "flex flex-col gap-2"
            )}>
                <div className="w-full flex-grow overflow-hidden">
                    <MessageList thread={thread} language={currentLanguage}/>
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