import {NextFunction, Request, Response} from "express";
import admin, {firestore} from "firebase-admin";
import {UserRecord} from "firebase-admin/auth";
import {ChatConfigType} from "../schemas/config";

const fs = firestore();

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization || null;
        if (token) {

            token = token.replace("Bearer ", "");
            const result = await admin.auth().verifyIdToken(token);
            const uid = result.uid;

            const user = await admin.auth().getUser(uid);
            const chatConfig = await fs.collection("configs").doc(user.uid).get();

            res.locals.token = token;
            res.locals.user = user;
            res.locals.chatConfig = chatConfig.data();

            return next();

        } else {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("Identity token is required");
        }

    } catch (e) {
        return res.status(401).send({
            error: (e as Error).message
        });
    }
}

export type AuthedRes = Response & {
    locals: {
        token: string,
        user: UserRecord,
        chatConfig: ChatConfigType
    }
}