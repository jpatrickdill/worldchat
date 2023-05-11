import {useUser} from "@/contexts/UserContext";
import {T} from "@/contexts/TransContext";
import 'react-phone-input-2/lib/material.css'
import {useEffect, useRef, useState} from "react";
import {getAuth, RecaptchaVerifier, UserCredential} from "firebase/auth";
import clsx from "clsx";
import PhoneMethod from "@/pages/Login/methods/PhoneMethod";

export default function Login({onClose}: {onClose: () => void}) {
    const {user, langConfig} = useUser();

    const [complete, setComplete] = useState(false);

    // should say "Sign Up" instead of "Log In"
    const [isSignUp] = useState(!!user?.isAnonymous && !!langConfig?.setupComplete);
    const actionText = isSignUp ? "Sign Up" : "Sign In"

    const recaptcha = useRef<RecaptchaVerifier>();
    const [recaptchaComplete, setRecaptchaComplete] = useState(false);

    useEffect(() => {
        if (recaptchaComplete) return;

        if (!recaptcha.current) {
            recaptcha.current = new RecaptchaVerifier("recaptcha-container", {
                size: "small",
                callback: () => {
                    setRecaptchaComplete(true);
                },
                "expired-callback": () => {
                    setRecaptchaComplete(false);
                }
            }, getAuth());
        }

        recaptcha.current.render();
    }, [recaptchaComplete]);

    const onSuccess = async (cred: UserCredential) => {
        console.log(cred);

        onClose();
    }

    return <div>
        <h1 className="text-xl text-center font-bold mb-4">
            {isSignUp ? <span>
                <T>Sign up to keep your conversations</T>
            </span> : <span>
                {/*<T>Log in to Hello Planet</T>*/}
            </span>}
        </h1>

        <div className="flex flex-col items-center">
            <div
                id="recaptcha-container"
                className={clsx({"hidden": recaptchaComplete})}
            />

            {recaptchaComplete ? <>
                <PhoneMethod
                    isLink={isSignUp}
                    recaptcha={recaptcha.current}
                    onSuccess={onSuccess}
                />
            </> : null}
        </div>


    </div>
}