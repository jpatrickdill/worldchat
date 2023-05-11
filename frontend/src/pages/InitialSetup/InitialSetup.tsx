import clsx from "clsx";
import LanguageDropdown from "../../components/LanguageDropdown";
import {useUser} from "../../contexts/UserContext";
import React, {useState} from "react";
import {T, useTranslation} from "../../contexts/TransContext";
import {Alert, useAlerts} from "../../contexts/AlertsContext";
import WordMark from "../../components/WordMark";
import {buttonCls, inputCls} from "../../styles";
import {Link} from "react-router-dom";
import {useApi} from "@/contexts/ApiContext";

export default function InitialSetup({fullPage}: { fullPage?: boolean }) {
    const {langConfig, updateLangConfig} = useUser();
    const api = useApi();
    const [step, setStep] = useState(1);

    const [regionInput, setRegionInput] = useState("");
    const [displayName, setDisplayName] = useState("");

    const regionPlaceholder = useTranslation("Optional");
    const namePlaceholder = useTranslation("What's your name?");

    const alerts = useAlerts();

    return <div className={clsx(
        {"flex h-full justify-center pt-24": fullPage}
    )}>
        {/* world-chat word mark on footer*/}

        <div className="fixed bottom-0 left-0 w-full flex justify-center pb-24">
            <WordMark className="text-3xl"/>
        </div>

        {/* actual setup */}

        <div className={clsx(
            {"w-full max-w-md p-4 bg-background rounded-md": fullPage},
            "flex flex-col gap-2"
        )}>
            {step === 1 ? <>
                <h1 className="text-xl font-bold">
                    <T>
                        What's your primary language?
                    </T>
                </h1>

                <div className="flex gap-2 items-stretch">
                    <div className="flex-grow">
                        <LanguageDropdown
                            value={langConfig?.language?.code}
                            onChange={async ({label, value}) => {
                                await updateLangConfig({
                                    language: {
                                        code: value,
                                        name: label,
                                        region: null
                                    }
                                })
                            }}
                        />
                    </div>

                    <button
                        className={clsx(
                            "bg-secondary hover:bg-secondary-dark text-copy-white",
                            "px-3 rounded-md text-lg"
                        )}
                        onClick={() => setStep(2)}
                    >
                        <i className="fa fa-arrow-right"/>
                    </button>
                </div>

                <div className="text-copy-gray text-sm mt-8 flex gap-3 items-center">
                    <div className="border-t border-gray-400 flex-grow"/>
                    <h2>
                        <T>Already have an account?</T>
                    </h2>
                    <div className="border-t border-gray-400 flex-grow"/>
                </div>

                <Link
                    to="/login"
                    className={clsx(
                        buttonCls, "text-copy-white flex gap-3 justify-center bg-secondary hover:bg-emerald-700"
                    )}
                >
                    <T>Sign in</T>
                    <i className="fa fa-arrow-right"/>
                </Link>
            </> : null}

            {step === 2 ? <>
                <h1 className="text-xl font-bold">
                    <T>
                        What country or region are you from? This helps us give better translations
                        and make conversation more natural.
                    </T>
                </h1>

                <div className="flex gap-2 items-stretch">
                    <input
                        className={inputCls}
                        placeholder={regionPlaceholder}
                        value={regionInput}
                        onChange={e => {
                            setRegionInput(e.target.value)
                        }}
                    />

                    <button
                        className={clsx(
                            "bg-secondary hover:bg-secondary-dark text-copy-white",
                            "px-3 rounded-md text-lg"
                        )}
                        onClick={async () => {
                            await updateLangConfig({
                                "language.region": regionInput
                            });
                            setStep(3);
                        }}
                    >
                        <i className="fa fa-arrow-right"/>
                    </button>
                </div>

                <div className="flex justify-center">
                    <button className="text-copy-gray hover:text-copy-dark text-sm"
                            onClick={() => setStep(step - 1)}>
                        <T>Go back</T>
                    </button>
                </div>

            </> : null}

            {step === 3 ? <>
                <h1 className="text-xl font-bold">
                    <T>Pick a friendly display name.</T>
                </h1>

                <div className="flex gap-2 items-stretch">
                    <input
                        className={inputCls}
                        placeholder={namePlaceholder}
                        value={displayName}
                        onChange={e => {
                            setDisplayName(e.target.value)
                        }}
                    />

                    <button
                        className={clsx(
                            "bg-secondary hover:bg-secondary-dark text-copy-white",
                            "px-3 rounded-md text-lg"
                        )}
                        onClick={async () => {
                            try {
                                await api.updateProfile({
                                    displayName
                                });
                                await updateLangConfig({
                                    "displayName": displayName,
                                    "setupComplete": true
                                });
                                setStep(4);
                            } catch (e: any) {
                                alerts.pushAlert(e.toString());
                            }

                        }}
                    >
                        <i className="fa fa-arrow-right"/>
                    </button>
                </div>

                <div className="flex justify-center">
                    <button className="text-copy-gray hover:text-copy-dark text-sm"
                            onClick={() => setStep(step - 1)}>
                        <T>Go back</T>
                    </button>
                </div>

            </> : null}
        </div>
    </div>
}