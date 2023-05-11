import {useThreads} from "@/contexts/ThreadsContext";
import clsx from "clsx";
import React, {Fragment, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {buttonCls} from "@/styles";
import {getMembersList, limitLength} from "@/utils/misc";
import {useUser} from "@/contexts/UserContext";
// import {useLayout} from "@/layout/Layout";
import {useTranslation} from "@/contexts/TransContext";
import {LangConfigType} from "@/schemas/config";
import ProfilePic from "@/components/ProfilePic";
import {ProfileType} from "@/schemas/profile";
import {useLayout} from "@/layout/Layout";

export default function ThreadsList() {
    const {threads} = useThreads();
    const {threadId} = useParams();
    const {user} = useUser();
    const {isMobile} = useLayout();
    const [hoveringIdx, setHoveringIdx] = useState<number>();

    const emptyChatText = useTranslation("Empty Chat");



    return <div className={clsx(
        "w-full h-full",
        "flex flex-col overflow-y-scroll items-stretch",
        // {"bg-background": isMobile}
    )}>
        {threads.map((thread, idx) => {
            const threadDisplayName = thread.members.length > 1 ? getMembersList(thread, [user?.uid], 3) : emptyChatText;

            const otherMembers = Object.entries(thread.membersMap)
                .filter(([id, member]) => !!member && id !== user?.uid);

            let [otherMemberId, otherMember]: [string | null, ProfileType | null] = [null, null];
            if (otherMembers.length > 0 && otherMembers[0][1] && otherMembers[0][1].profile) {
                otherMember = otherMembers[0][1].profile;
                otherMemberId = otherMembers[0][0];
            }

            return <Fragment key={thread.id}>
                <div>
                    <Link
                        className={clsx(
                            "pl-8 md:pl-4 pr-4",
                            "text-sm hover:bg-background-accent-darker",
                            // {"bg-background-accent-darker": thread.id === threadId},
                            "relative flex gap-4 items-center w-full h-full",
                        )}
                        to={`/t/${thread.id}`}
                        onMouseEnter={() => setHoveringIdx(idx)}
                        onMouseLeave={() => {
                            if (hoveringIdx === idx) setHoveringIdx(undefined)
                        }}
                    >
                        <ProfilePic
                            userId={otherMemberId} imageId={otherMember?.profileImageId}
                            size={isMobile ? 40 : 36}
                        />

                        <div className={clsx(
                            "flex-grow h-full flex flex-col justify-center",
                            {
                                "border-t border-border": (idx > 0 || isMobile) && ![idx, idx - 1].includes(hoveringIdx as number),
                                "mt-px": (idx > 0 || isMobile) && [idx, idx - 1].includes(hoveringIdx as number)
                            },
                            "py-3"
                        )}>
                            <h1 className="font-semibold text-md">
                                {threadDisplayName}
                            </h1>

                            <h2 className="text-copy-gray h-6">
                                {limitLength(thread?.lastMessage?.message?.content, 28)}
                            </h2>
                        </div>

                        {thread.id === threadId ? <div
                            className="absolute top-0 left-0 w-1 h-full bg-primary"
                        /> : null}
                    </Link>
                </div>
            </Fragment>
        })}
    </div>
}