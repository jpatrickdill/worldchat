import {z} from "zod";

export const languageSchema = z.object({
    name: z.string(),
    code: z.string(),
    region: z.string()
})