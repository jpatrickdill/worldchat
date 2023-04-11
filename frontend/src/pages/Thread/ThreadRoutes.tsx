import React, {useMemo} from "react";
import {Route, Routes} from "react-router";
import {useParams} from "react-router-dom";
import ThreadContainer from "@/pages/Thread/ThreadContainer";
import {useThreads} from "@/contexts/ThreadsContext";

export default function ThreadRoutes() {
    const {threadId} = useParams();
    const {threads} = useThreads();

    const thread = useMemo(() => {
        return threads.find((t) => t.id === threadId)
    }, [threadId, threads]);

    const el = thread ? <ThreadContainer thread={thread}/> : null

    return <Routes>
        <Route path="*" element={el}/>
    </Routes>
}