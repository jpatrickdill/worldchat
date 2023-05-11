import {useLayoutEffect} from "react";
import {Colors, Theme} from "@/theme/types";
import light from "@/theme/light";
import dark from "@/theme/dark";
import rose from "@/theme/rose";
import sky from "@/theme/sky";

export const themes = {
    light, dark, rose, sky
}

const walkThemeColors = (element: HTMLElement, prefix: string, colors: Colors) => {
    for (const [name, val] of Object.entries(colors)) {
        if (typeof val === "string") {
            let varName = name === "DEFAULT" ? prefix : prefix + "-" + name;

            element.style.setProperty(`--${varName}`, val);
        } else {
            walkThemeColors(element, prefix + "-" + name, val);
        }
    }
};

export const applyTheme = (theme: Theme, element: HTMLElement) => {
    // update CSS variables with theme colors
    walkThemeColors(element, "c", theme.colors);
};

export function useTheme(themeId: string, element?: HTMLElement) {
    useLayoutEffect(() => {
        if (!element) return;
        if (!themes[themeId as keyof typeof themes]) throw new Error("Theme doesn't exist");

        const theme = themes[themeId as keyof typeof themes];

        applyTheme(theme, element);
    }, [themeId, element]);
}