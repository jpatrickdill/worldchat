import {useUser} from "@/contexts/UserContext";
import React, {useLayoutEffect, useRef} from "react";
import {Theme} from "@/theme/types";
import Example from "@/pages/Settings/Theme/Example";
import {applyTheme} from "@/theme";
import {themes} from "@/theme";
import clsx from "clsx";
import {T} from "@/contexts/TransContext";

let themeList = Object.entries(themes).map(([tId, theme]) => ({
    id: tId,
    ...theme
}));

themeList.sort((a, b) => a.order - b.order);

function ThemePreview({theme, selected}: { theme: Theme, selected?: boolean }) {
    const exampleRef = useRef(null);

    useLayoutEffect(() => {
        if (!exampleRef.current) return;

        applyTheme(theme, exampleRef.current);
    }, [exampleRef.current])

    return <div className={clsx(
        "w-full rounded-xl overflow-hidden border-2 border-border",
        {"border-primary": selected}
    )}>
        <div ref={exampleRef}>
            <Example/>
        </div>
    </div>
}

export default function ThemeSettings() {
    const {langConfig, updateLangConfig} = useUser();
    const currentTheme = langConfig?.theme ?? "light";

    return <div className="flex flex-col items-stretch gap-2">
        {themeList.map(theme => {
            return <button
                className="flex flex-col"
                onClick={async () => {
                    await updateLangConfig({theme: theme.id})
                }}
            >
                <h1 className="pl-2">
                    <T>{theme.name}</T>
                </h1>

                <ThemePreview theme={theme} selected={theme.id === currentTheme}/>
            </button>
        })}
    </div>
}