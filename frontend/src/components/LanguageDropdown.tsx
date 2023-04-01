import React from "react";
import Select from "react-select";
import {languageCodeList} from "../utils/languages";
import {capitalize} from "../utils/misc";

type MaybePromise<T> = T | Promise<T>

const getLangName = (code: string) => new Intl.DisplayNames([code], {type: 'language'}).of(code)

export default function LanguageDropdown({value, onChange}: {
    value?: string,
    onChange?: ({label, value}: {label: string, value: string}) => MaybePromise<void>,
}) {
    const options = languageCodeList.map(code => ({
        label: capitalize(getLangName(code) || code.toUpperCase()),
        value: code
    }))

    return <Select
        options={options}
        value={value ? {
            label: capitalize(getLangName(value) || value.toUpperCase()),
            value
        } : undefined}
        onChange={async e => {
            if (!e) return;

            if (onChange) await onChange({
                label: e.label,
                value: e.value
            })
        }}
    />
}