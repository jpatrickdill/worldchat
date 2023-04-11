import "./lib/firebase";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {UserContextProvider} from "./contexts/UserContext";
import {ApiProvider} from "./contexts/ApiContext";
import {LoadingTranslationsAlert, TransContextProvider} from "./contexts/TransContext";
import {AlertsProvider} from "./contexts/AlertsContext";
import {ThreadsProvider} from "@/contexts/ThreadsContext";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ApiProvider>
                <UserContextProvider>
                    <TransContextProvider>
                        <AlertsProvider>
                            <ThreadsProvider>
                                <LoadingTranslationsAlert/>

                                <App/>
                            </ThreadsProvider>
                        </AlertsProvider>
                    </TransContextProvider>
                </UserContextProvider>
            </ApiProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
