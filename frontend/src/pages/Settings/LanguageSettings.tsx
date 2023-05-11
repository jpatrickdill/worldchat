import {useUser} from "@/contexts/UserContext";
import React, {useEffect, useState} from "react";
import {T, useTranslation} from "@/contexts/TransContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import {LanguageType} from "@/schemas/langauge";
import {buttonCls, inputCls} from "@/styles";
import clsx from "clsx";

export default function LanguageSettings() {
    const {langConfig, updateLangConfig} = useUser();

    const [lang, setLang] = useState<LanguageType>();
    const regionPlaceholder = useTranslation("Optional");

    useEffect(() => {
        if (langConfig?.language) setLang(langConfig.language);
    }, [langConfig]);

    console.log(langConfig);


    return <div className="flex flex-col items-stretch gap-2">
        <div>
            <p className="text-sm text-copy-gray">
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
                await updateLangConfig({language: newLang});
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

        {(lang?.region || "") !== (langConfig?.language?.region || "") ? <>
            <button
                className={clsx(buttonCls, "bg-green-500 hover:bg-green-600 text-copy-white justify-center font-semibold")}
                onClick={async () => {
                    await updateLangConfig({language: lang});
                }}
            >
                <i className="fa fa-check"/> <T>Save</T>
            </button>
        </> : null}
    </div>
}