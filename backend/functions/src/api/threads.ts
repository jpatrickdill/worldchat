import {firestore} from "firebase-admin";
import {Timestamp} from "firebase-admin/firestore";
import {Router} from "express";
import {auth, AuthedRes} from "./auth";
import {ThreadT} from "../schemas/thread";

const fs = firestore();

const threads = Router();
threads.use(auth);

threads.post("/new", async (req, res: AuthedRes) => {
    const {type: threadType} = req.body;

    if (!threadType) {
        return res.status(400).json({
            message: "Missing data."
        })
    }
    if (threadType === "public") {
        return res.status(400).json({
            message: "You can't create a public chat."
        })
    }

    const threadObj: ThreadT = {
        owner: {
            id: res.locals.user.uid,
            name: res.locals.chatConfig.displayName || "Unknown"
        },

        // this will get set by system and auto translated to users' languages.
        // setting this up with input language to be customizable in the future

        name: {
            content: "My New Chat",
            language: "English"
        },

        members: [res.locals.user.uid],
        createdAt: Timestamp.now(),

        type: threadType
    }

    const threadRef = await fs.collection("threads").doc();
    await threadRef.set(threadObj);

    return res.json({
        success: true,
        threadId: threadRef.id
    })
})

export default threads;