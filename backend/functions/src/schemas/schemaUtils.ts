import {firestore} from "firebase-admin";
import {z} from "zod";

export const timestampType = () => z.custom<firestore.Timestamp>();