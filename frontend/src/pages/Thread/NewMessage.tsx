import {useEffect, useLayoutEffect, useRef, useState} from "react";
import clsx from "clsx";
import {WithId} from "@/schemas/types";
import {LoadedThread} from "@/contexts/ThreadsContext";
import {T, useTranslation} from "@/contexts/TransContext";
import {useApi} from "@/contexts/ApiContext";
import {useUser} from "@/contexts/UserContext";
import {useStateHistory} from "@/utils/hooks";
import Button from "@/components/Button";
import {useLayout} from "@/layout/Layout";

export default function NewMessage({thread}: { thread: WithId<LoadedThread> }) {
    const api = useApi();
    const {langConfig} = useUser();

    const DEFAULT_HT = 40;

    const [message, setMessage] = useState("");
    const [prevMessage] = useStateHistory(message);
    const [loading, setLoading] = useState(false);

    const textarea = useRef<HTMLTextAreaElement>(null);

    // automatic text box size

    const [lines, setLines] = useState(1);
    useLayoutEffect(() => {
        if (!textarea.current) return;

        if (textarea.current.scrollHeight > textarea.current.offsetHeight) {
            setLines(lines + 1);
        }
    });
    useLayoutEffect(() => {
        const curLines = message.split("\n").length;
        const prevLines = prevMessage.split("\n").length;

        if (curLines < prevLines) {
            setLines(lines - (prevLines - curLines));
        }
    }, [message]);

    useEffect(() => {
        setMessage("");
        setLines(1);
    }, [thread?.id]);

    // submit

    const submit = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (message.length === 0 || message.length > 1000) return;
            if (message.replace(/\s/g, "").length === 0) return;
            if (!langConfig?.language) return;

            await api.sendMessage(thread.id, message, langConfig.language)

            setMessage("");
            setLines(1);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }

    const {ios, isMobile} = useLayout();

    const messagePlaceholder = useTranslation("Message") + "...";

    const buttonDisabled = message.length === 0 || message.length > 1000 || loading;

    return <div className={clsx(
        "flex-none px-4 py-3 lg:pb-6 border-t-2 border-border",
        "flex gap-x-2 lg:flex-col",
        {"pb-6": ios && isMobile}
    )}>
        <textarea
            ref={textarea}
            className={clsx(
                "w-full bg-input border border-input-border px-3 py-2 resize-none",
                "placeholder:text-copy-gray",
                {"rounded-3xl": isMobile},
                {"rounded-lg": !isMobile},
            )}
            // style={{height}}
            rows={lines}
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
            <p className="text-sm text-copy-gray select-none hidden lg:inline-block">
                <T>enter to send, shift+enter for newline</T>
            </p>
            <div className="flex-grow"/>
            <Button
                className={clsx(
                    "px-4 py-2 lg:mt-2",
                    {"hidden": buttonDisabled && isMobile}
                )}
                disabled={buttonDisabled}
                onClick={submit}
                pill={isMobile}
            >
                <i className="fa fa-send"/>
                <span className="ml-2 hidden lg:inline-block">
                    <T>Send</T>
                </span>
            </Button>
        </div>

    </div>
}