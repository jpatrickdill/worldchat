import {ButtonHTMLAttributes, HTMLProps, ReactNode} from "react";
import clsx from "clsx";

export default function Button({
                                   secondary,
                                   color, disabled, pill,
                                   className, disabledColor,
                                   onClick, buttonProps, children,
                                   loading
                               }: {
    secondary?: boolean, pill?: boolean
    disabled?: boolean, loading?: boolean,
    color?: string, disabledColor?: string
    className?: string,
    onClick?: () => any,
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>,
    children?: ReactNode
}) {
    let mainColors;
    let textColor;
    if (color) {
        mainColors = color.includes(" ") ? color : `bg-${color}-500 hover:bg-${color}-600`
        textColor = "text-white";
    } else {
        mainColors = secondary ? (
            "bg-secondary hover:bg-secondary-dark"
        ) : (
            "bg-primary hover:bg-primary-dark"
        );

        textColor = secondary ? "text-secondary-text" : "text-primary-text"
    }

    buttonProps = {
        onClick, disabled,
        ...buttonProps,
    }

    return <button
        className={clsx(
            "px-3 py-2 select-none",
            {
                "rounded-lg": !pill,
                "rounded-full": pill
            },
            {
                [mainColors]: !disabled,
                [disabledColor ? `bg-${disabledColor}-500` : "bg-disabled"]: disabled
            },
            textColor,
            className
        )}
        {...buttonProps}
    >
        {loading ? <i
            className="fa fa-circle-notch fa-spin"
        /> : children}
    </button>
}