import {useUser} from "./UserContext";
import {useApi} from "./ApiContext";
import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import crypto from "crypto";
import {HookSet, useSet} from "../utils/hooks";
import {Alert} from "./AlertsContext";

const getFirestoreId = (text: string) => {
    text = text.toLowerCase().trim();

    return text.replace(/\W/g, "-");
}
const getLangId = (code: string, region?: string | null) => {
    return code + (region ? "-" + region.toLowerCase() : "");
}

// context
/*
    This context will allow us to understand the state of all UI translations within the app,
    such as the number of components currently still being translated.
*/

interface TransContextT {
    inProgress: number,

    onStartTranslation: (text: string) => void,
    onStopTranslation: (text: string) => void
}

const TransContext = createContext<TransContextT>(undefined!);

export function TransContextProvider({children}: {children?: ReactNode}) {
    // sets with the transIds of strings translated by useTranslate()

    const inProgress = useSet<string>();

    const onStartTranslation = (v: string) => {
        inProgress.add(v);
    }

    const onStopTranslation = (v: string) => {
        inProgress.delete(v);
    }

    const val = {
        inProgress: inProgress.size,

        onStartTranslation, onStopTranslation
    }

    return <TransContext.Provider value={val}>
        {children}
    </TransContext.Provider>
}


export const useTransContext = () => useContext(TransContext);

export const useTranslation = (text?: string) => {
    const {chatConfig, configLoading} = useUser();

    const {onStartTranslation, onStopTranslation} = useTransContext();

    const api = useApi();
    const {http} = api;

    const [result, setResult] = useState<string>();

    const language = chatConfig?.language;
    const code = language?.code;
    const region = language?.region;
    const transId = getFirestoreId(text || "");
    const langId = getLangId(code || "", region);

    // for total UI visible count
    // useEffect(() => {
    //     totalSet?.add(transId);
    //
    //     return () => {
    //         totalSet?.del(transId);
    //     }
    // }, [])

    useEffect(() => {
        if (!text || text.length === 0) return;
        if (configLoading) return;
        if (!api.authenticated) return;
        if (result) return;

        if (!code) return;

        // don't translate for english users
        if (code === "en") {
            setResult(text);
            return;
        }

        if (local_cache[`${transId}--${langId}`]) {
            return;
        }

        onStartTranslation(transId);
        const transRef = doc(getFirestore(), `trans_cache/${transId}`);

        getDoc(transRef)
            .then(snap => {
                let translations = snap.data() || {};

                if (translations[langId]) {
                    // text has already been translated to this language AND region :D
                    setResult(translations[langId]);
                    local_cache[`${transId}--${langId}`] = translations[langId];

                    onStopTranslation(transId);
                } else {
                    // text hasn't been translated to this specific language/region combo,
                    // but we can check if it has been translated to the broader language already
                    // to provider a backup while we fetch the region specific text

                    if (translations[code]) {
                        setResult(translations[code]);
                    }

                    // fetch new translation

                    const body = {
                        content: text,
                        language: {
                            code, name: language.name || null, region: region || null
                        }
                    }

                    http.post("/translate/i18n", body)
                        .then(res => {
                            setResult(res.data.translated);
                            local_cache[`${transId}--${langId}`] = res.data.translated;

                            onStopTranslation(transId);
                        })
                        .catch(e => {
                            if (e.response) {
                                alert(e.response.data.message);
                            } else {
                                alert((e as Error).message)
                            }
                        });
                }
            });
    }, [text, chatConfig, configLoading, api?.authenticated, result]);

    useEffect(() => {
        // reset result if text or language changes
        setResult(undefined);
    }, [text, chatConfig])

    if (local_cache[`${transId}--${langId}`]) {
        return local_cache[`${transId}--${langId}`];
    }

    return result || text;
}


// local cache helps us with text that commonly re-appears,
// so it isn't being re-fetched from firestore
const local_cache: {[key: string]: string} = {};

export function T({children}: {children?: ReactNode}) {
    /*
        This element automatically translates its innerText to the user's selected language.
     */

    const contentRef = useRef<HTMLSpanElement>(null);
    const [ogText, setOgText] = useState<string>();

    // get the original innerText on first render, then translate
    useEffect(() => {
        if (ogText) return;

        if (contentRef.current) {
            setOgText(contentRef.current.innerText);
        }
    }, [contentRef.current]);

    const translated = useTranslation(ogText);

    if (translated) {
        return <span>
            {translated}
        </span>
    }

    return <span ref={contentRef}>
        {children}
    </span>
}

export function LoadingTranslationsAlert() {
    // when included in the app under an AlertsCtx, this will show an alert spinner
    // whenever UI is currently being translated.
    // to work properly this must be placed under both the translation and alerts context,
    // as the message inside this alert will also get translated (and get included in the count)

    const {inProgress} = useTransContext();
    const {chatConfig} = useUser();

    if (inProgress > 0) {
        return <Alert id="translating" loading minDuration={1000}>
            <T>
                Please wait while we finish translating the UI to
            </T>
            <span> {chatConfig?.language?.name}... </span>
        </Alert>
    }

    return null;
}