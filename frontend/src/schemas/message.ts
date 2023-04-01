import {z} from "zod";
import {languageSchema} from "./langauge";
import {timestampType} from "./schemaUtils";


// schemas

export const messageSchema = z.object({
    author: z.object({
        id: z.string(),
        name: z.string(),
        language: languageSchema
    }),
    originalText: z.string(),
    translations: z.array(
        // this contains all translated versions of the message with their language/region,
        // as well as the original for the author
        z.object({
            language: languageSchema,
            text: z.string()
        })
    ),
    status: z.enum([
        "submitted",
        "processing",
        "translated",
        "editSubmitted"
    ]),

    createdAt: timestampType()
})

export type MessageT = z.infer<typeof messageSchema>