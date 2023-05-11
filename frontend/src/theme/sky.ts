import colors from "tailwindcss/colors";
import {Theme} from "@/theme/types";

export default {
    name: "Sky",
    order: 3,
    colors: {
        primary: {
            light: colors.sky["400"],
            DEFAULT: colors.sky["500"],
            dark: colors.sky["600"],
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
                DEFAULT: colors.sky["50"],
                darker: colors.sky["100"]
            }
        },
        input: {
            DEFAULT: colors.sky["50"],
            border: colors.sky["100"],
        },
        border: colors.sky["200"],
        copy: {
            DEFAULT: colors.sky["950"],
            black: colors.sky["950"],
            dark: colors.sky["900"],
            gray: colors.sky["700"],
            white: colors.sky["50"]
        },
        disabled: colors.gray["600"]
    }
} as Theme