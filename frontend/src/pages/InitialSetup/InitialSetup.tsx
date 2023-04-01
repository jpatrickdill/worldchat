import clsx from "clsx";
import LanguageDropdown from "../../components/LanguageDropdown";
import {useUser} from "../../contexts/UserContext";
import React, {useState} from "react";
import {T, useTranslation} from "../../contexts/TransContext";
import {Alert} from "../../contexts/AlertsContext";
import WordMark from "../../components/WordMark";
import {inputCls} from "../../styles";

export default function InitialSetup({fullPage}: { fullPage?: boolean }) {
    const {chatConfig, updateChatConfig} = useUser();
    const [step, setStep] = useState(1);

    const [regionInput, setRegionInput] = useState("");
    const [displayName, setDisplayName] = useState("");

    const regionPlaceholder = useTranslation("Optional");
    const namePlaceholder = useTranslation("What's your name?");

    return <div className={clsx(
        {"flex h-full justify-center pt-24": fullPage}
    )}>
        {/* world-chat word mark on footer*/}

        <div className="fixed bottom-0 left-0 w-full flex justify-center pb-24">
            <WordMark className="text-3xl"/>
        </div>

        {/* actual setup */}

        <div className={clsx(
            {"w-full max-w-md p-4 bg-white rounded-md": fullPage},
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
                            value={chatConfig?.language?.code}
                            onChange={async ({label, value}) => {
                                await updateChatConfig({
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
                            "bg-emerald-500 hover:bg-emerald-600 text-white",
                            "px-3 rounded-md text-lg"
                        )}
                        onClick={() => setStep(2)}
                    >
                        <i className="fa fa-arrow-right"/>
                    </button>
                </div>
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
                            "bg-emerald-500 hover:bg-emerald-600 text-white",
                            "px-3 rounded-md text-lg"
                        )}
                        onClick={async () => {
                            await updateChatConfig({
                                "language.region": regionInput
                            });
                            setStep(3);
                        }}
                    >
                        <i className="fa fa-arrow-right"/>
                    </button>
                </div>

                <div className="flex justify-center">
                    <button className="text-gray-500 hover:text-gray-600 text-sm"
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
                            "bg-emerald-500 hover:bg-emerald-600 text-white",
                            "px-3 rounded-md text-lg"
                        )}
                        onClick={async () => {
                            await updateChatConfig({
                                "displayName": displayName,
                                "setupComplete": true
                            });
                            setStep(4);
                        }}
                    >
                        <i className="fa fa-arrow-right"/>
                    </button>
                </div>

                <div className="flex justify-center">
                    <button className="text-gray-500 hover:text-gray-600 text-sm"
                            onClick={() => setStep(step - 1)}>
                        <T>Go back</T>
                    </button>
                </div>

            </> : null}
        </div>
    </div>
}