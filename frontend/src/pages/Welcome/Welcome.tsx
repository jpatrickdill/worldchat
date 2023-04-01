import {T} from "../../contexts/TransContext";
import {Alert, useAlerts} from "../../contexts/AlertsContext";
import React, {useState} from "react";
import {buttonCls} from "../../styles";

export default function Welcome() {
    const [showAlert, setShowAlert] = useState(false);

    return <div className="p-2">
        <h1 className="text-lg font-bold">
            <T>
                Welcome to WorldChat! :-D
            </T>
        </h1>

        <button className={buttonCls} onClick={() => {
            setShowAlert(!showAlert);
        }}>
            Send Test Alert
        </button>


        {showAlert ? <Alert err>
            You pushed the button!
        </Alert> : null}
    </div>
}