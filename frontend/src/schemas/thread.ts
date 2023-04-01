import {z} from "zod";
import {timestampType} from "./schemaUtils";
import {messageSchema} from "./message";

export const threadSchema = z.object({
    name: z.object({
        content: z.string(),
        language: z.string()
    }),

    owner: z.object({
        id: z.string(),
        name: z.string()
    }),

    lastMessage: messageSchema,

    createdAt: timestampType(),
})

export type ThreadT = z.infer<typeof threadSchema>;