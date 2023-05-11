import {z} from "zod";
import {timestampType} from "@/schemas/schemaUtils";
import {Timestamp} from "firebase/firestore";

export const profileSchema = z.object({
    displayName: z.string(),
    profileImageId: z.string().nullable().optional(),
    createdAt: timestampType().default(() => Timestamp.fromDate(new Date(0)))
})

export type ProfileType = z.infer<typeof profileSchema>