import {Router} from "express";
import {translateString} from "../translate";
import {firestore} from "firebase-admin";
import {auth} from "./auth";

const fs = firestore();

const translate = Router();
translate.use(auth);

// create firebase safe ID based on text using md5 hash
const getFirestoreId = (text: string) => {
    text = text.toLowerCase().trim();

    return text.replace(/\W/g, "-");
}

translate.post("/i18n", async (req, res) => {
    try {
        const {content, language} = req.body;
        const {code, name, region} = language;

        if (!content || !language || !code || !name) {
            res.status(400).json({
                message: "Missing content."
            })
        }

        let langName = name + (region ? ` in ${region}` : "");

        let translation = code === "en" ? content : await translateString(content, langName);

        // store the translation in firestore for future uses
        const stringRef = fs.doc(`trans_cache/${getFirestoreId(content)}`);

        const langId = code + (region ? "-" + region.toLowerCase() : "");

        await stringRef.set({
            "en": content,
            [langId]: translation
        }, {merge: true})

        res.json({
            translated: translation
        });
    } catch (e) {
        res.status(500).json({
            message: (e as Error).message
        })
    }
})

export default translate;