import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Modal from "@/components/Modal";
import {useNavigate} from "react-router";
import clsx from "clsx";
import {T} from "@/contexts/TransContext";
import {useApi} from "@/contexts/ApiContext";

export default function UseInvite() {
    const {inviteId} = useParams();
    const navigate = useNavigate();
    const api = useApi();

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string>();

    useEffect(() => {
        if (!inviteId) {
            setLoading(false);
            setErr("No invite id given.");
            return;
        } else {
            setLoading(true);
            setErr(undefined);
        }

        api.useInvite(inviteId)
            .then((threadId) => {
                setLoading(false);
                navigate(`/t/${threadId}`);
            })
            .catch((e) => {
                setLoading(false);
                setErr((e as Error).message);
            })
    }, [inviteId])

    return <Modal showing className={clsx(
        "mx-auto w-full max-w-md lg:rounded-lg",
        "px-3 py-2 lg:p-5 bg-white shadow-sm",
        "flex flex-col gap-2"
    )}>
        {err ? <p>
            <T>{err}</T>
        </p> : loading ? <p>
            <T>You'll be redirected shortly.</T>
        </p> : <p>
            <T>Checking your invite...</T>
        </p>}
    </Modal>
}