import {z} from "zod";
import {languageSchema} from "./langauge";

export const chatConfigSchema = z.object({
    displayName: z.string().nullable().optional(),

    language: languageSchema.optional(),

    setupComplete: z.boolean().default(false)
});

export type ChatConfigType = z.infer<typeof chatConfigSchema>;