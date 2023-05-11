import {
    ConfirmationResult,
    getAuth,
    linkWithPhoneNumber,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    UserCredential
} from "firebase/auth";
import clsx from "clsx";
import PI from "react-phone-input-2";
import {buttonCls, inputCls} from "@/styles";
import React, {useState} from "react";
import {T} from "@/contexts/TransContext";
import Button from "@/components/Button";

// https://github.com/bl00mber/react-phone-input-2/issues/533#issuecomment-1259515379
const PhoneInput = ((PI as any).default ? (PI as any).default : PI) as typeof PI

export default function PhoneMethod({recaptcha, isLink, onSuccess}: {
    recaptcha?: RecaptchaVerifier,
    isLink?: boolean,
    onSuccess?: (cred: UserCredential) => void | Promise<void>
}) {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");

    const [sendingCode, setSendingCode] = useState(false);
    const [confirmation, setConfirmation] = useState<ConfirmationResult>();
    const [err, setErr] = useState<string>();

    const sendCode = async () => {
        if (sendingCode || !recaptcha) return;

        const auth = await getAuth();
        setSendingCode(true);

        try {
            let resp;
            if (isLink && auth.currentUser) {
                resp = await linkWithPhoneNumber(auth.currentUser, "+" + phone, recaptcha);
            } else {
                resp = await signInWithPhoneNumber(auth, "+" + phone, recaptcha);
            }

            setConfirmation(resp);
            setErr(undefined);
        } catch (e) {
            console.error(e);
            setConfirmation(undefined);
            setErr((e as Error).message);
        }

        setSendingCode(false);
    }

    const confirmCode = async () => {
        if (!confirmation) return;

        try {
            const cred = await confirmation.confirm(code);
            if (onSuccess) Promise.resolve(onSuccess(cred)).then()

            setErr(undefined);
        } catch (e) {
            console.error(e);
            setConfirmation(undefined);

            setErr((e as Error).message);
        }
    }

    if (!recaptcha) return null;
    return <div
        className={clsx("w-full flex flex-col gap-2")}
    >
        {err ? <div
            className="bg-red-200 border border-red-600 text-red-800 px-3 py-3 rounded-lg"
        >
            {err}
        </div> : null}

        {!confirmation ? <>
            <h2>
                <T>Enter your phone number to receive a code.</T>
            </h2>

            <div className="flex gap-2">
                <PhoneInput
                    inputStyle={{width: "100%", padding: "12px 48px"}}
                    specialLabel=""
                    country="us"
                    value={phone}
                    onChange={(val: string) => setPhone(val)}
                />
                <Button
                    className="text-lg w-12 rounded-md"
                    onClick={sendCode}
                >
                    <i className="fa fa-check"/>
                </Button>
            </div>
        </> : <>
            <h2>
                <T>We sent you a code!</T>
            </h2>

            <div className="flex gap-2">
                <input
                    className={inputCls}
                    placeholder="Enter your code"

                    value={code}
                    onChange={e => setCode(e.target.value)}
                    autoComplete="one-time-code"
                />
                <Button
                    className="text-lg"
                    onClick={confirmCode}
                >
                    <i className="fa fa-check"/>
                </Button>
            </div>
        </>}
    </div>
}