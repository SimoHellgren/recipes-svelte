import { z } from 'zod';


export const formSchema = z.object({
    name: z.string(),
    servings: z.string(),
    source: z.string(),
    method: z.string(),
    notes: z.string(),
    tags: z.array(z.string()),
    sections: z.array(z.object()) //hash out structure
})
