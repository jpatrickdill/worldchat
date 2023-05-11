import {z} from "zod";
import {timestampType} from "./schemaUtils";

export const profileSchema = z.object({
    displayName: z.string(),
    profileImageId: z.string().nullable().optional(),
    createdAt: timestampType()
})

export type ProfileType = z.infer<typeof profileSchema>