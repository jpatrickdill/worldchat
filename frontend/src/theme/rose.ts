import colors from "tailwindcss/colors";
import {Theme} from "@/theme/types";

export default {
    name: "Pink",
    order: 2,
    colors: {
        primary: {
            light: colors.pink["400"],
            DEFAULT: colors.pink["500"],
            dark: colors.pink["600"],
            text: colors.white
        },
        secondary: {
            light: colors.emerald["400"],
            DEFAULT: colors.emerald["500"],
            dark: colors.emerald["600"],
            text: colors.white
        },
        background: {
            DEFAULT: colors.white,
            accent: {
                DEFAULT: colors.pink["100"],
                darker: colors.pink["200"]
            }
        },
        input: {
            DEFAULT: colors.pink["50"],
            border: colors.pink["100"],
        },
        border: colors.pink["200"],
        copy: {
            DEFAULT: colors.rose["950"],
            black: colors.rose["900"],
            dark: colors.rose["800"],
            gray: colors.rose["700"],
            white: colors.rose["50"]
        },
        disabled: colors.gray["500"]
    }
} as Theme