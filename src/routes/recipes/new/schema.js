import { z } from 'zod';


export const formSchema = z.object({
    name: z.string(),
    servings: z.string(),
    source: z.string(),
    method: z.string(),
    notes: z.string(),
    tags: z.string(),
    sections: z.string()
})
