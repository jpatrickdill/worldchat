import clsx from "clsx";
import React, {useEffect, useState} from "react";
import {T} from "../contexts/TransContext";

const earthIcons = [
    "americas",
    "europe",
    "africa",
    "asia",
    "oceania"
]

export default function WordMark({className}: {className?: string}) {
    const [earthIdx, setEarthIdx] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setEarthIdx(idx => {
                if (idx + 1 >= earthIcons.length) return 0;
                return idx + 1;
            });
        }, 1500);

        return () => clearInterval(intervalId);
    }, []);

    const earthIcon = earthIcons.at(earthIdx) || earthIcons[0];

    return <div className={clsx(
        "flex gap-2 items-center select-none font-bold text-primary-dark",
        className
    )}>
        <span>
            <i className={`fa fa-earth-${earthIcon}`}/> <i className="fa fa-comment"/>
        </span>
        <T>Hello Planet</T>
    </div>
}