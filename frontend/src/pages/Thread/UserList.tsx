import {WithId} from "@/schemas/types";
import {ThreadWithMembers} from "@/contexts/ThreadsContext";
import clsx from "clsx";
import InviteButton from "@/pages/Thread/InviteButton";

export default function UserList({thread}: { thread: WithId<ThreadWithMembers> }) {
    return <div className="w-full h-full flex flex-col p-1 ">
        {Object.entries(thread.membersMap).map(([id, member]) => <div
            className={clsx(
                "p-2",
                "flex gap-3 items-center",
                "text-gray-900"
            )}
            key={id}
        >
            <i className="fa fa-user-circle text-3xl text-gray-400"/>

            <div className="leading-5">
                <h3 className="font-bold">{member?.displayName}</h3>
                <p>{member?.language?.name}</p>
            </div>
        </div>)}

        <InviteButton threadId={thread.id}/>
    </div>
}