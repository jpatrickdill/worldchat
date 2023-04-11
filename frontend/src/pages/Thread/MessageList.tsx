import clsx from "clsx";
import {useContext, useEffect, useRef, useState} from "react";
import {
    Timestamp,
    query,
    orderBy,
    startAfter,
    limit,
    getDocs,
    onSnapshot,
    updateDoc,
    collection, getFirestore
} from "firebase/firestore";
import moment from "moment";
import {Link, useParams} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import {MessageT} from "@/schemas/message";
import {WithId} from "@/schemas/types";
import {ThreadWithMembers} from "@/contexts/ThreadsContext";
import Loading from "@/components/Loading";
import {useUser} from "@/contexts/UserContext";
import Message from "@/pages/Thread/Message";
import {T} from "@/contexts/TransContext";

const formatTimestamp = (ts: Timestamp) => moment(ts.toDate()).format("MMMM DD, h:mm A")

const getScrollBottom = (el: HTMLElement) => {
    return el.scrollHeight - el.offsetHeight - el.scrollTop;
}

export default function MessageList({thread}: { thread: WithId<ThreadWithMembers> }) {
    const threadId = thread.id;

    const {user} = useUser();

    const [oldMessages, setOldMessages] = useState<WithId<MessageT>[]>([]);
    const [newMessages, setNewMessages] = useState<WithId<MessageT>[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadedOldest, setLoadedOldest] = useState(false);
    const [earliestDate, setEarliestDate] = useState<Timestamp>();
    const PER_LOAD = 10;

    const [hoveringMsg, setHoveringMsg] = useState<string>();

    const containerRef = useRef<HTMLDivElement>(null);

    const maybeScroll = () => {
        if (containerRef.current && (getScrollBottom(containerRef.current) === 0)) {
            setTimeout(() => {
                if (!containerRef.current) return;

                containerRef.current.scrollTop = containerRef.current.scrollHeight
            }, 10)
        }
    }

    const loadMessages = async (reset?: boolean) => {
        setLoading(true);

        let q = query(
            collection(getFirestore(), `threads/${threadId}/messages`),
            orderBy("createdAt", "desc"),
            limit(PER_LOAD)
        );

        if (!reset && earliestDate) q = query(q, startAfter(earliestDate));

        const snap = await getDocs(q);
        setOldMessages([
            ...snap.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            } as WithId<MessageT>)).reverse(),
            ...(!reset ? oldMessages : [])
        ])

        if (snap.size > 0) {
            setEarliestDate(snap.docs[snap.size - 1].data().createdAt);
        }
        if (snap.size < PER_LOAD) setLoadedOldest(true);

        setLoading(false);
        maybeScroll();
    }

    // initial load
    // also resets when thread id changes
    useEffect(() => {
        setOldMessages([]);
        setNewMessages([]);
        setEarliestDate(undefined);
        setLoadedOldest(false);

        loadMessages(true).then()

        // listen for new messages
        let q = query(
            collection(getFirestore(), `threads/${threadId}/messages`),
            orderBy("createdAt", "asc"),
            startAfter(Timestamp.now())
        );

        return onSnapshot(q, (snap) => {
            setNewMessages(
                snap.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                } as WithId<MessageT>))
            );

            maybeScroll()
        })
    }, [threadId]);

    const messages = [...oldMessages, ...newMessages];

    // group messages by author

    const messageGroups: {
        author: MessageT["author"],
        messages: WithId<MessageT>[]
    }[] = messages.length ? [{
        author: messages[0].author,
        messages: []
    }] : [];

    for (let message of messages) {
        if (message.author.id !== messageGroups[messageGroups.length - 1].author.id) {
            messageGroups.push({
                author: message.author,
                messages: []
            })
        }

        messageGroups[messageGroups.length - 1].messages.push(message);
    }

    const MSG_PAD = "px-3 py-1"

    return <div
        className={clsx(
            "flex-grow overflow-y-scroll overflow-x-hidden",
            "flex flex-col gap-y-2 py-2"
        )}
        onWheel={(e) => {
            if (e.deltaY >= 0) return;
            if (e.currentTarget.scrollTop === 0 && !loadedOldest) loadMessages().then();
        }}
        id="messages"
        ref={containerRef}
    >
        {!loadedOldest ? <div
            className={clsx(
                "w-full flex items-center justify-center pb-2",
                "text-gray-500 border-b border-gray-200 select-none"
            )}
            onClick={() => loadMessages().then()}
        >
            <span className="hidden lg:inline-block">
                <T>scroll to load more</T>...
            </span>
            <span className="lg:hidden">
                <T>tap to load more</T>...
            </span>
        </div> : null}
        {loading ? <div className={clsx(
            "w-full flex items-center justify-center h-16",
            {"h-full": oldMessages.length === 0}
        )}>
            <Loading/>
        </div> : null}
        {messageGroups.map((group, idx) => <>
            {/*{*/}
            {/*    group.messages[0].createdAt*/}
            {/*}*/}
            <div className={clsx(
                "flex gap-2 relative w-full"
            )}>
                <div className="flex-grow flex flex-col w-full">
                    <div className={clsx(
                        "flex gap-x-2 items-center text-gray-500 select-none",
                        {"hidden": group.messages[0].author.id === user?.uid},
                        MSG_PAD
                    )}>
                        <Link
                            className="text-gray-800 font-semibold hover:underline"
                            to={`/user/${group.author}`}
                        >
                            {(thread.membersMap[group.author.id])?.displayName || "?"}
                        </Link>
                        <span>&middot;</span>
                        <span>{formatTimestamp(group.messages[0].createdAt)}</span>
                    </div>

                    {group.messages.map((msg) => <>
                        <Message message={msg}/>
                    </>)}
                </div>
            </div>
        </>)}
    </div>
}