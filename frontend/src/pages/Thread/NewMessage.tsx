import {useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {WithId} from "@/schemas/types";
import {ThreadWithMembers} from "@/contexts/ThreadsContext";
import {T, useTranslation} from "@/contexts/TransContext";
import {useApi} from "@/contexts/ApiContext";
import {useUser} from "@/contexts/UserContext";

export default function NewMessage({thread}: { thread: WithId<ThreadWithMembers> }) {
    const api = useApi();
    const {chatConfig} = useUser();

    const DEFAULT_HT = 40

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [height, setHeight] = useState(DEFAULT_HT);
    const textarea = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!textarea.current) return;

        setHeight(Math.min(textarea.current.scrollHeight, 500));
    }, [textarea.current?.value])

    useEffect(() => {
        setMessage("");
        setHeight(DEFAULT_HT);
    }, [thread?.id])

    const submit = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (message.length === 0 || message.length > 1000) return;
            if (message.replace(/\s/g, "").length === 0) return;
            if (!chatConfig?.language) return;

            await api.sendMessage(thread.id, message, chatConfig.language)

            setMessage("");
            setHeight(DEFAULT_HT);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }

    const isMobile = window.innerWidth <= 640;

    const messagePlaceholder = useTranslation("Say hello") + "...";


    return <div className={clsx(
        "flex-none px-4 pt-3 pb-6 border-t-2 border-gray-200",
        "flex flex-col"
    )}>
        <textarea
            ref={textarea}
            className={clsx(
                "w-full rounded-lg bg-gray-100 px-3 py-2 resize-none border border-gray-200/20"
            )}
            style={{
                height
            }}
            placeholder={messagePlaceholder}
            value={message}
            onChange={(e) => {
                setMessage(e.currentTarget.value.slice(0, 1000))
            }}
            onKeyDown={async (e) => {
                if (e.key === "Enter") {
                    if (!e.shiftKey && !isMobile) {
                        e.preventDefault();

                        await submit();
                    }
                }
            }}
        />
        <div className="flex">
            <p className="text-sm text-gray-500/70 select-none hidden lg:inline-block">
                <T>enter to send, shift+enter for newline</T>
            </p>
            <div className="flex-grow"/>
            <button
                className={`bg-blue-500 hover:bg-blue-600 px-4 py-2 mt-2 text-white text-center
                            rounded-lg hover:disabled:cursor-not-allowed
                            disabled:bg-gray-500 hover:disabled:bg-gray-500 flex-none`}
                disabled={message.length === 0 || message.length > 1000 || loading}
                onClick={submit}
            >
                <i className="fa fa-send mr-1"/> <T>Send</T>
            </button>
        </div>

    </div>
}