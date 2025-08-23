import { z } from 'zod';


export const formSchema = z.object({
    name: z.string(),
    servings: z.object({
        quantity: z.number().default(0),
        unit: z.string().default("hlö")
    }),
    source: z.string(),
    method: z.string(),
    notes: z.string(),
    tags: z.array(z.string()),
    sections: z.array(z.string()).default([""]) //hash out structure
})
