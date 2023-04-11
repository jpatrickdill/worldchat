import React, {createContext, ReactNode, useContext, useEffect} from "react";
import {User, getAuth, signInAnonymously} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {doc, getFirestore, updateDoc, setDoc} from "firebase/firestore";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {ChatConfigType, chatConfigSchema} from "../schemas/config";
import {Outlet} from "react-router";
import InitialSetup from "../pages/InitialSetup/InitialSetup";
import {getLangName} from "@/components/LanguageDropdown";

interface userContextT {
    chatConfig?: ChatConfigType,
    configLoading: boolean
    updateChatConfig: (fields: {[key: string]: any}) => Promise<void>,

    user?: User | null,
    userLoading: boolean,
}

const defaultVal: userContextT = {
    userLoading: true, configLoading: true,
    updateChatConfig: async (fields) => {}
}

const UserContext = createContext<userContextT>(defaultVal);

export function UserContextProvider({children}: {children?: ReactNode}) {
    const [authUser, authLoading] = useAuthState(getAuth());

    const configDocRef = doc(getFirestore(), `configs/${authUser?.uid || "undefined"}`);
    const [configData, configLoading] = useDocumentData(configDocRef);

    // set blank chat config if none is present
    useEffect(() => {
        if (!configData && !configLoading && authUser) {
            let code = navigator.language.split("-")[0].toLowerCase()
            setDoc(configDocRef, {
                language: {
                    code, name: getLangName(code),
                    region: null
                },
                displayName: null
            }).then();
        }
    }, [configData, configLoading, authUser])

    let chatConfig: ChatConfigType | undefined;

    if (configData) chatConfig = configData as ChatConfigType;

    const ctxVal: userContextT = {
        chatConfig: chatConfig,
        configLoading: configLoading,
        updateChatConfig: async (fields: {[key: string]: any}) => {
            await updateDoc(configDocRef, fields);
        },

        user: authUser,
        userLoading: authLoading
    }

    useEffect(() => {
        if (!authLoading && !authUser) {
            // if not signed in, sign in as anonymous so that we can still chat.
            // set default language based on browser language

            signInAnonymously(getAuth())
                .then(async (cred) => {
                    let uid = cred.user.uid;

                    const newConfigDocRef = doc(getFirestore(), `configs/${uid}`);
                    await setDoc(newConfigDocRef, {
                        language: {
                            code: navigator.language.split("-")[0].toLowerCase(),
                            region: null
                        },
                        displayName: null
                    });
                })
        }
    }, [authLoading, authUser])

    return <UserContext.Provider value={ctxVal}>
        {children}
    </UserContext.Provider>
}

export const useUser = () => useContext(UserContext);