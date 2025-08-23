import { optional, z } from 'zod';


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
    sections: z.array(z.object({
        name: z.nullable(z.string()),
        ingredients: z.array(z.object({
            name: z.string(),
            quantity: z.number(),
            unit: z.string(),
            // comment: z.string(),
            // optional: z.boolean(),
        }))
    })).default([{ name: null, ingredients: [{ name: null, quantity: null, unit: null }] }])
})
