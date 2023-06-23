import {useApi} from "@/contexts/ApiContext";
import React, {ReactNode, useState} from "react";
import clsx from "clsx";
import {buttonCls} from "@/styles";
import OldModal from "@/contexts/Modals/OldModal";
import {useAlerts} from "@/contexts/AlertsContext";
import {T} from "@/contexts/TransContext";
import Loading from "@/components/Loading";
import Modal from "@/contexts/Modals/Modal";

export default function InviteButton({threadId, children, className}: {
    threadId: string, children?: ReactNode, className?: string
}) {
    const {pushAlert} = useAlerts();
    const api = useApi();

    const [loading, setLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState<string>();
    const [showModal, setShowModal] = useState(false);

    let linkPrefix = window.location.host + "/join/";


    return <>
        <button
            className={clsx(buttonCls, "bg-transparent hover:bg-background-accent-darker/75", className)}
            disabled={loading}
            onClick={async () => {
                if (inviteCode) {
                    setShowModal(true);
                    return;
                }

                setLoading(true);
                setShowModal(true);

                try {
                    const inviteId = await api.createInvite(threadId);

                    setInviteCode(inviteId);
                } catch (e) {
                    pushAlert({content: (e as Error).message, err: true});
                }

                setLoading(false);
            }}
        >
            {children ?? <>
                + <T>Create Invite</T>
            </>}
        </button>

        <Modal
            onClose={() => setShowModal(false)} enabled={showModal} className={clsx(
            "lg:rounded-lg",
            "px-3 py-2 md:p-5",
            "flex flex-col gap-2"
        )}
            title="Invite People"
        >
            {loading ? <>
                <Loading full/>
            </> : <>
                <p>
                    <T>Copy this link and send it to the person you want to invite:</T>
                </p>

                <input
                    className={clsx(
                        "w-full rounded-lg bg-background-accent px-3 py-2 border border-background-accent-darker/20"
                    )}
                    readOnly
                    value={linkPrefix + inviteCode}
                />
            </>}
        </Modal>
    </>
}