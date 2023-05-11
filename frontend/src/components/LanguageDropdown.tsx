import React from "react";
import Select from "react-select";
import {languageCodeList} from "@/utils/languages";
import {capitalize} from "@/utils/misc";

type MaybePromise<T> = T | Promise<T>

export const getLangName = (code: string) => new Intl.DisplayNames([code], {type: 'language'}).of(code)

export default function LanguageDropdown({value, onChange}: {
    value?: string,
    onChange?: ({label, value}: { label: string, value: string }) => MaybePromise<void>,
}) {
    const options = languageCodeList.map(code => ({
        label: capitalize(getLangName(code) || code.toUpperCase()),
        value: code
    }))

    return <Select
        styles={{
            control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            group: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            groupHeading: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            indicatorsContainer: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            indicatorSeparator: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            loadingIndicator: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            loadingMessage: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            menuList: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            input: (base) => ({
                ...base,
                color: "var(--c-copy)"
            }),
            menuPortal: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--c-background-accent)",
                borderColor: "var(--c-border)",
                color: "var(--c-copy)",
            }),
            multiValue: (baseStyles) => ({
                ...baseStyles,
                color: "var(--c-copy)",
            }),
            multiValueLabel: (baseStyles) => ({
                ...baseStyles,
                color: "var(--c-copy)",
            }),
            singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "var(--c-copy)",
            })
        }}
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