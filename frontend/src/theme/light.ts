import colors from "tailwindcss/colors";
import {Theme} from "@/theme/types";

export default {
    name: "Light",
    order: 0,
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
            DEFAULT: colors.white,
            accent: {
                DEFAULT: colors.gray["100"],
                darker: colors.gray["200"]
            }
        },
        input: {
            DEFAULT: colors.gray["100"],
            border: colors.gray["100"],
        },
        border: colors.gray["200"],
        copy: {
            DEFAULT: colors.black,
            black: colors.black,
            dark: colors.gray["700"],
            gray: colors.gray["500"],
            white: colors.white
        },
        disabled: colors.gray["600"]
    }
} as Theme