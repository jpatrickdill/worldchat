import {useUser} from "@/contexts/UserContext";
import React, {useEffect, useState} from "react";
import {T, useTranslation} from "@/contexts/TransContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import {LanguageType} from "@/schemas/langauge";
import {buttonCls, inputCls} from "@/styles";
import clsx from "clsx";

export default function LanguageSettings() {
    const {chatConfig, updateChatConfig} = useUser();

    const [lang, setLang] = useState<LanguageType>();
    const regionPlaceholder = useTranslation("Optional");

    useEffect(() => {
        if (chatConfig?.language) setLang(chatConfig.language);
    }, [chatConfig]);

    console.log(chatConfig);


    return <div className="flex flex-col items-stretch gap-2">
        <div>
            <h1 className="text-lg font-semibold underline underline-offset-2">
                <T>Language</T>
            </h1>
            <p className="text-sm text-gray-500">
                <T>
                    If you change your language, old messages won't be translated, and may not be
                    visible in your new language.
                </T>
            </p>
        </div>


        <LanguageDropdown
            value={lang?.code}
            onChange={async ({label, value}) => {
                let newLang = {
                    code: value,
                    name: label,
                    region: null
                }

                // for input (save button)
                setLang(newLang);
                await updateChatConfig({language: newLang});
            }}
        />

        <div>
            <h2>
                <T>Country / Region / Dialect</T>
            </h2>

            <input
                className={inputCls}
                placeholder={regionPlaceholder}
                value={lang?.region || ""}
                onChange={e => {
                    if (lang)  {
                        setLang({
                            ...lang,
                            region: e.target.value
                        })
                    }
                }}
            />
        </div>

        {(lang?.region || "") !== (chatConfig?.language?.region || "") ? <>
            <button
                className={clsx(buttonCls, "bg-green-500 hover:bg-green-600 text-white justify-center font-semibold")}
                onClick={async () => {
                    await updateChatConfig({language: lang});
                }}
            >
                <i className="fa fa-check"/> <T>Save</T>
            </button>
        </> : null}
    </div>
}