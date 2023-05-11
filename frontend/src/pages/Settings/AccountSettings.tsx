import {useUser} from "@/contexts/UserContext";
import React, {useEffect, useState} from "react";
import {T, useTranslation} from "@/contexts/TransContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import {LanguageType} from "@/schemas/langauge";
import {buttonCls, inputCls} from "@/styles";
import clsx from "clsx";
import {useSignOut} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import Button from "@/components/Button";

export default function AccountSettings() {
    const [signOut] = useSignOut(getAuth());

    return <div className="flex flex-col items-stretch gap-2">
        <Button
            onClick={() => {
                window.location.reload();
            }}
        >
            <T>Update App</T>
        </Button>
        <Button
            onClick={async () => {
                await signOut();
            }}
        >
            <T>Sign Out</T>
        </Button>
    </div>
}