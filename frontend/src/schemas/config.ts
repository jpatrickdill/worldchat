import {z} from "zod";
import {languageSchema} from "./langauge";

export const langConfigSchema = z.object({
    displayName: z.string().nullable().optional(),

    language: languageSchema.optional(),

    setupComplete: z.boolean().default(false),

    theme: z.string().default("light")
});

export type LangConfigType = z.infer<typeof langConfigSchema>;