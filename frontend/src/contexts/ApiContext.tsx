import axios, {AxiosInstance, isAxiosError} from "axios";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useUser} from "./UserContext";
import {Outlet} from "react-router";
import {getAuth, getIdToken} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {ThreadT} from "../schemas/thread";
import {LanguageType} from "@/schemas/langauge";
import {ProfileType} from "@/schemas/profile";

const BASE_URLs = {
    dev: `http://${window.location.hostname}:5001/tardis-chat/us-central1/api`,
    prod: "https://us-central1-tardis-chat.cloudfunctions.net/api"
}

const detectEnvironment = () => {
    if (
        window.location.hostname.includes("localhost")
        || (window.location.hostname.split(".").length > 3)
    ) return "dev";

    return "prod";
}

class Api {
    http: AxiosInstance;
    authenticated: boolean;
    base: string;

    constructor(token?: string) {
        this.base = BASE_URLs[detectEnvironment()];

        this.http = axios.create({
            baseURL: this.base,
            headers: {
                Authorization: token || ""
            }
        })

        this.authenticated = !!token;
    }

    // error handler

    handleAxiosErr<T>(err: any) {
        console.error(err);
        if (err.response) {
            throw new Error(err.response.data.message)
        } else {
            throw err;
        }

        // noinspection UnreachableCodeJS
        return undefined as T;
    }

    // user
    async updateProfile(data: Partial<ProfileType>) {
        try {
            const res = await this.http.post("/profile/update", data);
            return res.data as ProfileType;
        } catch (err) {
            return this.handleAxiosErr(err);
        }
    }

    // threads
    async createThread(threadType: ThreadT["type"]): Promise<string> {
        try {
            const res = await this.http.post("/threads/new", {
                type: threadType
            });
            return res.data.threadId as string;
        } catch (err) {
            return this.handleAxiosErr(err);
        }
    }

    async createInvite(threadId: string): Promise<string> {
        try {
            const res = await this.http.post(`/threads/${threadId}/invite`);

            return res.data.inviteId as string;
        } catch (err) {
            return this.handleAxiosErr(err);
        }
    }

    async useInvite(inviteCode: string): Promise<string> {
        try {
            const res = await this.http.post(`threads/join/${inviteCode}`);

            return res.data.threadId as string;
        } catch (err) {
            return this.handleAxiosErr(err);
        }
    }

    async sendMessage(threadId: string, content: string, language: LanguageType) {
        try {
            const res = await this.http.post(`threads/${threadId}/message`, {
                content, language
            });

            return res.data.messageId as string;
        } catch (err) {
            return this.handleAxiosErr(err);
        }
    }
}

const ApiContext = createContext<Api>(new Api());

export function ApiProvider({children}: { children?: ReactNode }) {
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