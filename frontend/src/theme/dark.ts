import colors from "tailwindcss/colors";
import {Theme} from "@/theme/types";

export default {
    name: "Dark",
    order: 1,
    colors: {
        primary: {
            light: colors.blue["400"],
            DEFAULT: colors.blue["500"],
            dark: colors.blue["600"],
            text: colors.white
        },
        secondary: {
            light: colors.emerald["400"],
            DEFAULT: colors.emerald["500"],
            dark: colors.emerald["600"],
            text: colors.white
        },
        background: {
            DEFAULT: colors.gray["800"],
            accent: {
                DEFAULT: colors.gray["700"],
                darker: colors.gray["600"]
            }
        },
        input: {
            DEFAULT: colors.gray["700"],
            border: colors.gray["600"],
        },
        border: colors.gray["700"],
        copy: {
            DEFAULT: colors.white,
            black: colors.white,
            dark: colors.gray["300"],
            gray: colors.gray["300"],
            white: colors.white
        },
        disabled: colors.gray["600"]
    }
} as Theme