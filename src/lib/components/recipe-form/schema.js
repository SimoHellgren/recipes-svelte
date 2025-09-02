import { optional, z } from 'zod';


export const formSchema = z.object({
    name: z.string(),
    yield: z.object({
        quantity: z.number().default(1),
        unit: z.string().default("hlö")
    }),
    source: z.string(),
    method: z.string(),
    notes: z.nullable(z.string()),
    tags: z.array(z.string()),
    sections: z.array(z.object({
        name: z.nullable(z.string()),
        ingredients: z.array(z.object({
            name: z.string(),
            quantity: z.number(),
            unit: z.string(),
            // comment: z.nullable(z.string()),
            // optional: z.boolean().default(false),
        }))
    })).default([{
        name: null,
        ingredients: [
            {
                name: null,
                quantity: null,
                unit: null,
                // comment: null, 
                // optional: false,
            }
        ]
    }])
})

export const editSchema = formSchema.extend({
    id: z.number()
})
