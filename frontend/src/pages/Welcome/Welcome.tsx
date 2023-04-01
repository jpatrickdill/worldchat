import {T} from "../../contexts/TransContext";
import {Alert, useAlerts} from "../../contexts/AlertsContext";
import React, {useState} from "react";
import {buttonCls} from "../../styles";

export default function Welcome() {
    const {pushAlert} = useAlerts();
    
    const [counter, setCounter] = useState(0);

    return <div className="p-2">
        <h1 className="text-lg font-bold">
            <T>
                Welcome to WorldChat! :-D
            </T>
        </h1>

        <Alert err>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Alert>
        <Alert loading>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Alert>
        <Alert>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Alert>

        <button className={buttonCls} onClick={() => {
            pushAlert({
                id: "counter",
                content: `You pushed the button ${counter} times!`
            });

            setCounter(counter + 1);
        }}>
            Send Test Alert
        </button>


        {/*<Alert>*/}
        {/*    You pushed the button {counter} times!*/}
        {/*</Alert>*/}
    </div>
}