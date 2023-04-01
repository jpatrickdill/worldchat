import {z} from "zod";

export const chatConfigSchema = z.object({
    displayName: z.string().nullable().optional(),

    language: z.object({
        code: z.string(),
        name: z.string().optional(),
        region: z.string().nullable().optional()
    }).optional(),

    setupComplete: z.boolean().default(false)
})

export type ChatConfigType = z.infer<typeof chatConfigSchema>