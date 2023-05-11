import clsx from "clsx";

export const inputCls = clsx(
    "w-full px-3 py-2 rounded-md",
    "border border-border bg-background-accent",
)

export const buttonCls = clsx(
    "rounded-md overflow-hidden",
    "text-copy-dark hover:bg-background-accent-darker",
    "flex gap-x-2 items-center px-3 py-2",
    "transition-all",
    "disabled:hover:cursor-not-allowed"
)