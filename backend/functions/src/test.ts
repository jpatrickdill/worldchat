import * as dotenv from "dotenv";
dotenv.config();

import {translateMessage} from "./translate";

const main = async () => {
    let response = await translateMessage({
        content: '"It\'s called, we do a little trolling" - Donald Trump',
        dialect: {
            name: "English",
            code: "en"
        },
        to: [
            {
                name: "Spanish",
                code: "es",
                region: "Ecuador"
            },
            {
                name: "Norsk",
                code: "no",
            }
        ]
    });

    console.log(response);
}

main().then();