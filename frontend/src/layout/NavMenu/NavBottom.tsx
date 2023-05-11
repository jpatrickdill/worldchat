import clsx from "clsx";
import {buttonCls} from "@/styles";
import {T} from "@/contexts/TransContext";
import {Link} from "react-router-dom";
import WordMark from "@/components/WordMark";
import React, {useState} from "react";
import {useUser} from "@/contexts/UserContext";
import LoginModal from "@/pages/Login/LoginModal";

export default function NavBottom() {
    const {user} = useUser();
    const [showSignIn, setShowSignIn] = useState(false);

    return <>
        <div className={clsx(
            "border-t-2 border-background-accent-darker",
            "flex flex-col p-2 pb-5"
        )}>
            {user?.isAnonymous ? <>
                <button
                    className={buttonCls}
                    onClick={() => setShowSignIn(!showSignIn)}
                >
                    <i className="fa fa-user"/>
                    <span> <T>Sign Up</T></span>
                </button>
            </> : null}

            <Link
                className={buttonCls}
                to="/settings"
            >
                <i className="fa fa-cog"/>
                <span> <T>Settings</T></span>
            </Link>

            <div className="flex justify-center mt-2">
                <WordMark/>
            </div>
        </div>

        <LoginModal
            onClose={() => setShowSignIn(false)}
            showing={showSignIn}
        />
    </>
}