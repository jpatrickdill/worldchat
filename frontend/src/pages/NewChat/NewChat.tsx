import Modal from "@/contexts/Modals/Modal";
import React, {useState} from "react";
import {WithId} from "@/schemas/types";
import {ProfileType} from "@/schemas/profile";
import clsx from "clsx";
import {T, useTranslation} from "@/contexts/TransContext";
import Button from "@/components/Button";
import {useApi} from "@/contexts/ApiContext";
import {useNavigate} from "react-router";
import {useLayout} from "@/layout/Layout";

export default function NewChat({enabled, onClose}: { enabled: boolean, onClose: () => void }) {
    const [members, setMembers] = useState<WithId<ProfileType>[]>([]);
    const [creating, setCreating] = useState(false);
    const [err, setErr] = useState<string>();
    const {isMobile} = useLayout();
    const api = useApi();
    const navigate = useNavigate();

    const memberSearchPlaceholder = useTranslation("Add members");

    const createChat = async () => {
        setCreating(true);
        setErr(undefined);
        try {
            const threadId = await api.createThread("group");

            onClose();
            navigate(`/t/${threadId}`);
        } catch (e) {
            setErr((e as Error).message);
        }
        setCreating(false);
    }

    return <Modal
        enabled={enabled} onClose={onClose}
        className="h-full"
        buttonEl="Cancel"
        title="New Message"
    >
        <div className="h-full flex flex-col items-stretch">
            <input
                className={clsx(
                    "flex-none w-full px-3 py-2 rounded-none",
                    "border-b border-border bg-background"
                )}
                placeholder={`${memberSearchPlaceholder}...`}
            />

            <div
                className="flex-grow"
                style={isMobile ? {} : {minHeight: 100}}
            >
            </div>

            <div className="px-2 pb-2 pt-2">
                <div className="rounded-lg bg-background-accent text-copy-dark text-center p-3">
                    <T>
                        After the chat is created, an invite link will be generated
                        to invite others, including people who don't have accounts yet.
                    </T>
                </div>
            </div>

            <div className="px-2 pb-2 bg-background">
                <Button
                    className="w-full" loading={creating}
                    onClick={createChat}
                >
                    {members.length === 0 ? <>
                        <T>Create Empty Chat</T>
                    </> : null}
                </Button>
            </div>
        </div>
    </Modal>
}