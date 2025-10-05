import { optional, z } from 'zod';

export const cartSchema = z.object({
    id: z.string().uuid(),
    name: z.optional(z.string()).default(null),
    date: z.optional(z.string().date()),
    recipes: z.array(z.object({
        id: z.string().uuid(),
        recipe_id: z.number().int(),
        scaling_factor: z.number().default(1),
    }
    ))
})