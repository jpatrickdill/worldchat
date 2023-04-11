import React, {useState} from 'react'
import reactLogo from './assets/react.svg'
import {Outlet, Route, Routes} from "react-router";
import {UserContextProvider, useUser} from "./contexts/UserContext";
import Welcome from "./pages/Welcome/Welcome";
import {ApiProvider} from "./contexts/ApiContext";
import {LoadingTranslationsAlert, useTransContext} from "./contexts/TransContext";
import InitialSetup from "./pages/InitialSetup/InitialSetup";
import Layout from "./layout/Layout";
import {Alert} from "./contexts/AlertsContext";
import ThreadRoutes from "@/pages/Thread/ThreadRoutes";
import UseInvite from "@/pages/Invites/UseInvite";
import Settings from "@/pages/Settings/Settings";

function App() {
    const {userLoading, configLoading, chatConfig} = useUser();

    if (userLoading || configLoading) {
        return <p>Loading...</p>
    }

    const injectSetup = () => {
        if (!chatConfig?.setupComplete) {
            return <InitialSetup fullPage/>
        } else {
            return <Outlet/>
        }
    }

    return <div className="w-screen h-screen overflow-hidden">
        <Routes>
            <Route element={injectSetup()}>
                <Route element={<Layout/>}>
                    <Route index element={<Welcome/>}/>

                    <Route path="join/:inviteId" element={<UseInvite/>}/>

                    <Route path="t/:threadId/*" element={<ThreadRoutes/>}/>

                    <Route path="settings" element={<Settings/>}/>
                    <Route path="*" element={<Welcome/>}/>
                </Route>
            </Route>
        </Routes>
    </div>

}

export default App
