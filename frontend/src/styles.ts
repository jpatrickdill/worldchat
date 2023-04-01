import clsx from "clsx";

export const inputCls = clsx(
    "w-full px-3 py-2 rounded-md",
    "border border-gray-300 bg-white",
)

export const buttonCls = clsx(
    "rounded-md border border-gray-400 text-gray-600 hover:bg-gray-200",
    "flex gap-x-2 items-center px-3 py-2",
    "transition-all",
    "disabled:hover:cursor-not-allowed disabled:hover:bg-transparent"
)