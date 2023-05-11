import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";

const fs = firestore();

export const onAccountCreate = functions.auth.user().onCreate(async user => {
    await fs.doc(`profiles/${user.uid}`).create({
        displayName: null,
        createdAt: new Date()
    })
})