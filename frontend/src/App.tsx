import React, {useState} from 'react'
import reactLogo from './assets/react.svg'
import {Outlet, Route, Routes} from "react-router";
import {UserContextProvider, useUser} from "./contexts/UserContext";
import Welcome from "./pages/Welcome/Welcome";
import {ApiProvider} from "./contexts/ApiContext";
import {LoadingTranslationsAlert, useTransContext} from "./contexts/TransContext";
import InitialSetup from "./pages/InitialSetup/InitialSetup";
import Layout from "./components/Layout/Layout";
import {Alert} from "./contexts/AlertsContext";

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

                    <Route path="*" element={<Welcome/>}/>
                </Route>

            </Route>
        </Routes>
    </div>

}

export default App
