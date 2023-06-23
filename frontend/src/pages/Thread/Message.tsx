import {WithId} from "@/schemas/types";
import {MessageT} from "@/schemas/message";
import clsx from "clsx";
import {useUser} from "@/contexts/UserContext";
import {ReactNode, useMemo, useState} from "react";
import moment from "moment";
import {BeatLoader} from "react-spinners";
import {LanguageType} from "@/schemas/langauge";
import LanguageDropdown from "@/components/LanguageDropdown";
import {T} from "@/contexts/TransContext";
import {langCompare} from "@/utils/misc";
import {useClosestTranslation} from "@/utils/hooks";


type Translation = MessageT["message"];

export default function Message({message, language}: { message: WithId<MessageT>, language?: LanguageType }) {
    const {user, langConfig} = useUser();
    const [hover, setHover] = useState(false);
    const [showOpposite, setShowOpposite] = useState(false);

    const {status} = message;

    const closestMatch = useClosestTranslation(message, language);

    let msgErr = false;

    let messageContent: ReactNode;
    if (showOpposite) {
        let text: string | undefined;
        if (message.author.id !== user?.uid) {
            text = message.message.content;
        } else if (!!langConfig?.language) {
            text = message.translations
                .reduce<Translation[]>((acc, cur) => {
                    if (cur.language.code !== langConfig.language?.code) {
                        if (!acc.find(tr => tr.language.code === cur.language.code)) {
                            acc.push(cur)
                        }
                    }

                    return acc;
                }, [])
                .map(tr => {
                    return `${tr.language.name}: "${tr.content}"`
                }).join("\n\n");
        }

        text ||= "";

        messageContent = text.split("\n").map((text, idx) => {
            return <div
                key={idx} className="break-words"
            >
                <p>
                    {text}
                </p>
            </div>
        })

    } else if (status === "processing") {
        messageContent = <div className="">
            <BeatLoader color="white" size={8}/>
        </div>
    } else if (status === "error") {
        messageContent = <T>{message.statusMessage}</T>
    } else if (status === "translated" && closestMatch) {
        let text = closestMatch.content;

        messageContent = text.split("\n").map((text, idx) => {
            return <div
                key={idx} className="break-words"
            >
                <p>
                    {text}
                </p>
            </div>
        })
    } else {
        messageContent = <T>
            No translation found
        </T>
        msgErr = true;
    }

    return <div
        onMouseEnter={() => {
            setHover(true)
        }} onMouseLeave={() => {
        setHover(false)
    }}
        className={clsx(
            "px-3 py-1 select-text"
        )}
    >
        <div className={clsx(
            "flex items-center justify-between",
            {
                "flex-row-reverse": message.author.id === user?.uid,
            }
        )}>
            <div className={clsx(
                "px-3 py-1 rounded-xl",
                "flex justify-center items-center max-w-sm",
                {
                    "bg-background-accent text-copy-dark border border-background-accent-darker": message.author.id !== user?.uid,
                    "bg-primary text-copy-white": message.author.id === user?.uid,
                    "bg-red-500 text-copy-white": msgErr
                }
            )}>
                <div className="flex flex-col">
                    {messageContent}
                </div>
            </div>

            {hover ? <div className={clsx(
                "flex gap-3",
                {"flex-row-reverse": message.author.id === user?.uid}
            )}>
                <span className="text-copy-gray">
                    {moment(message.createdAt.toDate()).format("h:mm A")}
                </span>
            </div> : null}
        </div>
    </div>
}