import React, {useEffect, useLayoutEffect, useState} from 'react'
import {Outlet, Route, Routes} from "react-router";
import {useUser} from "./contexts/UserContext";
import Welcome from "./pages/Welcome/Welcome";
import InitialSetup from "./pages/InitialSetup/InitialSetup";
import Layout, {useLayout} from "./layout/Layout";
import ThreadRoutes from "@/pages/Thread/ThreadRoutes";
import UseInvite from "@/pages/Invites/UseInvite";
import Settings from "@/pages/Settings/Settings";
import LoginPage from "@/pages/Login/LoginPage";
import NavMenu from "@/layout/NavMenu";
import {useTheme} from "@/theme";
import {ModalsProvider} from "@/contexts/Modals/ModalContext";

function Index() {
    const layout = useLayout();
    const isMobile = layout?.isMobile;

    return isMobile ? <NavMenu/> : null
}

function App() {
    const [bgColor, setBgColor] = useState("#fff");

    const {userLoading, configLoading, langConfig} = useUser();
    useTheme(langConfig?.theme ?? "light", document.documentElement);
    useLayoutEffect(() => {
        // set theme color to match BG color

        const bgColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--c-background');

        setBgColor(bgColor);
    }, [langConfig?.theme]);

    const injectSetup = () => {
        if (!langConfig?.setupComplete) {
            return <Routes>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="join/:joinCode" element={<InitialSetup fullPage/>}/>
                <Route path="*" element={<InitialSetup fullPage/>}/>
            </Routes>
        } else {
            return <Outlet/>
        }
    }

    useEffect(() => {
        const appHeight = () => {
            const doc = document.documentElement
            doc.style.setProperty("--app-height", `${window.innerHeight}px`)
        }
        window.addEventListener("resize", appHeight)
        appHeight()
    }, []);

    if (userLoading || configLoading) {
        return <p>Loading...</p>
    }

    return <ModalsProvider>
        <Routes>
            <Route path="/*" element={injectSetup()}>
                <Route element={<Layout/>}>
                    <Route index element={<Index/>}/>

                    <Route path="join/:inviteId" element={<UseInvite/>}/>

                    <Route path="t/:threadId/*" element={<ThreadRoutes/>}/>

                    <Route path="settings/*" element={<Settings/>}/>
                    <Route path="*" element={<Welcome/>}/>
                </Route>
            </Route>
        </Routes>
    </ModalsProvider>

}

export default App
