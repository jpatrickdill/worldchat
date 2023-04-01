import {Timestamp} from "firebase/firestore";
import {z} from "zod";

export const timestampType = () => z.custom<Timestamp>();