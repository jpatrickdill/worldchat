import {z} from "zod";
import {languageSchema} from "./langauge";
import {timestampType} from "./schemaUtils";


// schemas

export const messageSchema = z.object({
    author: z.object({
        id: z.string(),
        name: z.string()
    }),
    message: z.object({
        language: languageSchema,
        content: z.string()
    }),
    translations: z.array(
        // this contains all translated versions of the message with their language/region,
        // as well as the original for the author
        z.object({
            language: languageSchema,
            content: z.string()
        })
    ).default([]),
    status: z.enum([
        "submitted",
        "processing",
        "translated",
        "error"
    ]).default("submitted"),
    statusMessage: z.string().nullable().optional(),

    createdAt: timestampType()
})

export type MessageT = z.infer<typeof messageSchema>