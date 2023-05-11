import {firestore} from "firebase-admin";
import {Router} from "express";
import {auth, AuthedRes} from "./auth";
import {profileSchema} from "../schemas/profile";

const fs = firestore();

const profileRoutes = Router();
profileRoutes.use(auth);

profileRoutes.post("/update", async (req, res: AuthedRes) => {
    try {
        const profileRef = fs.doc(`profiles/${res.locals.user.uid}`);

        const prevData = (await profileRef.get()).data();
        const newData = {
            ...prevData,
            ...req.body
        };

        try {
            await profileRef.set(profileSchema.parse(newData), {
                    merge: true
                }
            );

            res.status(200).json({
                success: true,
                data: newData
            })
        } catch {
            res.status(400).json({
                success: false,
                message: "Invalid profile data"
            });
        }
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }

})

export default profileRoutes;