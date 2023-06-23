import clsx from "clsx";
import {ReactElement, useContext, useEffect, useLayoutEffect, useRef, useState, WheelEventHandler} from "react";
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
import {LoadedThread} from "@/contexts/ThreadsContext";
import Loading from "@/components/Loading";
import {useUser} from "@/contexts/UserContext";
import Message from "@/pages/Thread/Message";
import {T} from "@/contexts/TransContext";
import {useLayout} from "@/layout/Layout";
import {LanguageType} from "@/schemas/langauge";

const formatTimestamp = (ts: Timestamp) => moment(ts.toDate()).format("MMMM DD, h:mm A")

const getScrollBottom = (el: HTMLElement) => {
    return el.scrollHeight - el.offsetHeight - el.scrollTop;
}

export default function MessageList({thread, language}: { thread: WithId<LoadedThread>, language?: LanguageType }) {
    const threadId = thread.id;

    const {user} = useUser();

    const {isMobile} = useLayout();

    const [oldMessages, setOldMessages] = useState<WithId<MessageT>[]>([]);
    const [newMessages, setNewMessages] = useState<WithId<MessageT>[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadedOldest, setLoadedOldest] = useState(false);
    const [earliestDate, setEarliestDate] = useState<Timestamp>();
    const [isBottom, setIsBottom] = useState(true);
    const [prevHeight, setPrevHeight] = useState(0);
    const PER_LOAD = 10;

    const [hoveringMsg, setHoveringMsg] = useState<string>();

    const containerRef = useRef<HTMLDivElement>(null);

    const loadMessages = async (reset?: boolean) => {
        if (loading) return;
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
    }

    // initial load
    // also resets when thread id changes
    useEffect(() => {
        setOldMessages([]);
        setNewMessages([]);
        setEarliestDate(undefined);
        setLoadedOldest(false);
        setIsBottom(true);

        loadMessages(true).then();

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
        })
    }, [threadId]);

    // scroll to bottom for new messages if already at bottom
    useEffect(() => {
        if (!containerRef.current) return;

        const scrollHeight = containerRef.current.scrollHeight

        if (isBottom && !isMobile) {
            containerRef.current.scrollTop = scrollHeight;
        }

        if (isMobile) containerRef.current.scrollTop = scrollHeight + (scrollHeight - prevHeight);
    }, [oldMessages, newMessages]);

    const messages = [...oldMessages, ...newMessages];


    // group messages by author

    let messageGroups: {
        key: string,
        author: MessageT["author"],
        messages: WithId<MessageT>[]
    }[] = [];

    if (messages.length > 0) {
        messageGroups = messages.reduce((acc, cur, idx, src) => {
            const prev = idx > 0 ? src[idx-1] : undefined;

            if (cur.author.id !== prev?.author?.id) {
                acc.push({key: cur.id, author: cur.author, messages: []});
            } else if (cur.createdAt.toDate().valueOf() - (prev?.createdAt.toDate().valueOf() || 0) > 5*60*1000) {
                acc.push({key: cur.id, author: cur.author, messages: []});
            }

            acc.at(-1)?.messages?.push(cur);

            return acc;
        }, messageGroups);
    }

    const MSG_PAD = "px-3 py-1"

    const onScroll = (e: any) => {
        if (e.currentTarget.scrollTop === 0 && !loadedOldest && !isMobile) loadMessages().then();

        // is at bottom of messages list?
        // used for autoscrolling
        setIsBottom(getScrollBottom(e.currentTarget) === 0);
    }

    return <div
        className={clsx(
            "overflow-y-scroll h-full",
            "flex flex-col gap-y-2 py-2"
        )}
        onWheel={onScroll as WheelEventHandler<HTMLDivElement>}
        onDrag={onScroll}
        id="messages"
        ref={containerRef}
    >
        {!loadedOldest ? <div
            className={clsx(
                "w-full flex items-center justify-center pb-2",
                "text-copy-gray border-b border-background-accent-darker select-none"
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
            <div
                className={clsx(
                    "flex gap-2 relative w-full"
                )}
                key={group.key}
            >
                <div className="flex-grow flex flex-col w-full">
                    <div className={clsx(
                        "flex gap-x-2 items-center text-copy-gray select-none",
                        {"hidden": group.messages[0].author.id === user?.uid},
                        MSG_PAD
                    )}>
                        <Link
                            className="text-copy-dark font-semibold hover:underline"
                            to={`/user/${group.author.id}`}
                        >
                            {(thread.membersMap[group.author.id])?.profile.displayName || "?"}
                        </Link>
                        <span>&middot;</span>
                        <span>{formatTimestamp(group.messages[0].createdAt)}</span>
                    </div>

                    {group.messages.map((msg) => <>
                        <Message message={msg} language={language}/>
                    </>)}
                </div>
            </div>
        </>)}
    </div>
}