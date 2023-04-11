import {BeatLoader} from "react-spinners"
import clsx from "clsx";

export default function Loading({full, color, className}: { full?: boolean, color?: string, className?: string }) {
    color ??= "lightgray";

    if (full) {
        return <div
            className={clsx("w-full h-full flex items-center justify-center", className)}
        >
            <BeatLoader color={color}/>
        </div>
    }

    return <BeatLoader color={color}/>
}