import Login from "@/pages/Login/Login";
import {useNavigate} from "react-router";
import WordMark from "@/components/WordMark";
import React from "react";

export default function LoginPage() {
    const navigate = useNavigate();

    return <>
        <div className="flex h-full justify-center pt-24">
            <div className="w-full max-w-md p-4">
                <Login onClose={() => navigate("/")}/>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full flex justify-center pb-24">
            <WordMark className="text-3xl"/>
        </div>
    </>
}