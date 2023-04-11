// noinspection ExceptionCaughtLocallyJS

import {firestore} from "firebase-admin";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {Router} from "express";
import {auth, AuthedRes} from "./auth";
import {ThreadT} from "../schemas/thread";
import {messageSchema} from "../schemas/message";
import {languageSchema, LanguageType} from "../schemas/langauge";
import {translateMessage} from "../translate";
import {chatConfigSchema} from "../schemas/config";
import * as functions from "firebase-functions";

const fs = firestore();

const threads = Router();
threads.use(auth);

// util

async function getUserLanguages(users: string[]): Promise<LanguageType[]> {
    const promises: Promise<LanguageType | undefined>[] = [];

    for (let uid of users) {
        let getLang = async () => {
            const chatConfigDoc = await fs.doc(`configs/${uid}`).get();

            return chatConfigSchema.parse(chatConfigDoc.data()).language;
        }

        promises.push(getLang());
    }

    let responses = await Promise.all(promises);
    let langs = responses.filter(maybeLang => !!maybeLang) as LanguageType[];

    return langs
}

// new thread

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

// create invite

threads.post("/:threadId/invite", async (req, res: AuthedRes) => {
    const {threadId} = req.params;
    const threadRef = fs.collection("threads").doc(threadId);
    const threadDoc = await threadRef.get();
    const thread = threadDoc.data() as ThreadT;

    if (thread.owner.id !== res.locals.user.uid) {
        return res.status(403).json({
            success: false,
            message: "Only thread owners can create invites."
        })
    }

    const inviteRef = await threadRef.collection("invites").doc();
    await inviteRef.set({
        id: inviteRef.id,
        threadId,
        maxUses: 3,
        uses: 0,

        createdBy: res.locals.chatConfig,
        createdAt: Timestamp.now(),
    });

    return res.json({
        success: true,
        inviteId: inviteRef.id
    })
});

// use invite

threads.post("/join/:inviteId", async (req, res: AuthedRes) => {
    const {inviteId} = req.params;

    const inviteSnap = await fs.collectionGroup("invites")
        .where("id", "==", inviteId)
        .get();

    if (inviteSnap.size < 1) {
        return res.status(403).json({
            success: false,
            message: "Couldn't find invite"
        })
    }

    const inviteDoc = inviteSnap.docs[0];
    const {uses, maxUses, threadId} = inviteDoc.data();

    if (uses >= maxUses) {
        return res.status(404).json({
            success: false,
            message: "Invite is used up"
        })
    }

    const threadRef = fs.collection("threads").doc(threadId);

    await threadRef.update({
        members: FieldValue.arrayUnion(res.locals.user.uid)
    })

    await inviteDoc.ref.update({
        uses: FieldValue.increment(1)
    })

    return res.json({
        success: true,
        threadId
    })
});

// send message

threads.post("/:threadId/message", async (req, res: AuthedRes) => {
    const {threadId} = req.params;
    const threadRef = fs.collection("threads").doc(threadId);
    const threadDoc = await threadRef.get();

    if (!threadDoc.exists) {
        return res.status(404).json({
            success: false,
            message: "Thread doesn't exist"
        })
    }

    const threadData = threadDoc.data() as ThreadT;

    if (!threadData.members.includes(res.locals.user.uid)) {
        return res.status(403).json({
            success: false,
            message: "You aren't a member of this thread"
        })
    }

    let {content, language} = req.body;

    try {
        if (typeof content !== "string") throw new Error("Bad content");

        language = languageSchema.parse(language);
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Malformed message object"
        })
    }

    const messageObj = messageSchema.parse({
        author: {
            id: res.locals.user.uid,
            name: res.locals.chatConfig.displayName || "Unknown"
        },
        message: {
            language, content
        },
        translations: [],
        status: "processing",
        statusMessage: "We're translating this message.",

        createdAt: Timestamp.now()
    });

    const messageRef = await threadRef.collection("messages").add(messageObj);

    // get languages to translate to, then translate.
    // Use then here so the request can close while translation is still happening
    getUserLanguages(
        threadData.members.filter(uid => uid !== res.locals.user.uid)  // don't translate to author's lang
    )
        .then(async (memberLanguages) => {
            try {
                let translations = await translateMessage({
                    content,
                    dialect: language,
                    to: memberLanguages
                });

                await messageRef.update({
                    translations: [
                        ...translations,
                        {
                            language,
                            content
                        }
                    ],
                    status: "translated",
                    statusMessage: null
                });
            } catch (e) {
                await messageRef.update({
                    status: "error",
                    statusMessage: "There was an issue translating this message."
                });

                functions.logger.error(e);
            }

        });

    return res.json({
        success: true,
        messageId: messageRef.id
    })
})

export default threads;