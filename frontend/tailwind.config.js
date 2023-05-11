const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                modalsbg: "var(--modalsbg)",

                primary: {
                    light: "var(--c-primary-light)",
                    DEFAULT: "var(--c-primary)",
                    dark: "var(--c-primary-dark)",
                    text: "var(--c-primary-text)"
                },
                secondary: {
                    light: "var(--c-secondary-light)",
                    DEFAULT: "var(--c-secondary)",
                    dark: "var(--c-secondary-dark)",
                    text: "var(--c-secondary-text)"
                },
                background: {
                    DEFAULT: "var(--c-background)",
                    accent: {
                        DEFAULT: "var(--c-background-accent)",
                        darker: "var(--c-background-accent-darker)"
                    }
                },
                border: "var(--c-border)",
                input: {
                    DEFAULT: "var(--c-input)",
                    border: "var(--c-input-border)"
                },
                copy: {
                    DEFAULT: "var(--c-copy)",
                    black: "var(--c-copy-black)",
                    dark: "var(--c-copy-dark)",
                    gray: "var(--c-copy-gray)",
                    white: "var(--c-copy-white)"
                },
                disabled: "var(--c-disabled)"
            }
        },
    },
    plugins: [],
}

