import axios, {AxiosInstance, isAxiosError} from "axios";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useUser} from "./UserContext";
import {Outlet} from "react-router";
import {getAuth, getIdToken} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {ThreadT} from "../schemas/thread";

const BASE_URLs = {
    dev: "http://127.0.0.1:5001/tardis-chat/us-central1/api",
    prod: "https://us-central1-tardis-chat.cloudfunctions.net/api"
}

const detectEnvironment = () => {
    if (
        window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
    ) return "dev";

    return "prod";
}

class Api {
    http: AxiosInstance;
    authenticated: boolean;

    constructor(token?: string) {
        let base = BASE_URLs[detectEnvironment()];

        this.http = axios.create({
            baseURL: base,
            headers: {
                Authorization: token || ""
            }
        })

        this.authenticated = !!token;
    }

    // error handler

    handleAxiosErr<T>(err: unknown) {
        if (isAxiosError(err)) {
            if (err.response) {
                throw new Error(err.response.data.message)
            } else {
                throw err;
            }
        } else {
            throw err;
        }

        // noinspection UnreachableCodeJS
        return undefined as T;
    }

    // threads
    async createThread(threadType: ThreadT["type"]): Promise<string> {
        try {
            const res = await this.http.post("/threads/new", {
                type: threadType
            });
            return res.data.threadId as string;
        }  catch (err) {
            return this.handleAxiosErr(err);
        }
    }
}

const ApiContext = createContext<Api>(new Api());

export function ApiProvider({children}: {children?: ReactNode}) {
    const [user, userLoading] = useAuthState(getAuth());
    const [api, setApi] = useState<Api>(new Api());

    // const [refresh, setRefresh] = useState(0);  // used to auto-refresh token

    useEffect(() => {
        if (!user) {
            setApi(
                new Api()
            );
        } else {
            getIdToken(user)
                .then(token => {
                    setApi(
                        new Api(token)
                    )
                });
        }
    }, [user?.uid, userLoading]);

    return <ApiContext.Provider value={api}>
        <Outlet/>
        {children}
    </ApiContext.Provider>
}

export const useApi = () => useContext(ApiContext);