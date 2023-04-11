import {TopBar} from "@/layout/TopBar";
import React from "react";
import PageContent from "@/layout/PageContent";
import LanguageSettings from "@/pages/Settings/LanguageSettings";
import {T} from "@/contexts/TransContext";

export default function Settings() {
    return <>
        <TopBar>
            <T>Settings</T>
        </TopBar>
        <PageContent>
            <div className="p-4 w-full h-full grid gap-4 grid-cols-1 lg:grid-cols-2">
                <div className="">
                    <LanguageSettings/>
                </div>
                <div className="">

                </div>
            </div>
        </PageContent>
    </>
}