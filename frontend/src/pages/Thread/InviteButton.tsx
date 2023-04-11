import {useApi} from "@/contexts/ApiContext";
import React, {ReactNode, useState} from "react";
import clsx from "clsx";
import {buttonCls} from "@/styles";
import Modal from "@/components/Modal";
import {useAlerts} from "@/contexts/AlertsContext";
import {T} from "@/contexts/TransContext";
import Loading from "@/components/Loading";

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
            className={clsx(buttonCls, "bg-transparent hover:bg-gray-200/75", className)}
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

        <Modal onClose={() => setShowModal(false)} showing={showModal} className={clsx(
            "mx-auto w-full max-w-lg lg:rounded-lg",
            "px-3 py-2 lg:p-5 bg-white shadow-sm",
            "flex flex-col gap-2"
        )}>
            {loading ? <>
                <Loading full/>
            </> : <>
                <p>
                    <T>Copy this link and send it to the person you want to invite:</T>
                </p>

                <input
                    className={clsx(
                        "w-full rounded-lg bg-gray-100 px-3 py-2 border border-gray-200/20"
                    )}
                    readOnly
                    value={linkPrefix + inviteCode}
                />
            </>}
        </Modal>
    </>
}