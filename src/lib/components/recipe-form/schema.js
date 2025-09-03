import { optional, z } from 'zod';

// TODO: is there a nicer way to reuse the defaults?
const defaultIngredient = {
    name: null,
    quantity: null,
    unit: null,
    // comment: null, 
    // optional: false,
}

const defaultSection = {
    name: null,
    ingredients: [defaultIngredient]
}

const ingredientSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    // comment: z.nullable(z.string()),
    // optional: z.boolean().default(false),
}).default(defaultIngredient)

const sectionSchema = z.object({
    name: z.nullable(z.string()),
    ingredients: z.array(ingredientSchema)
}).default(defaultSection)

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
    sections: z.array(sectionSchema).default([defaultSection])
})

export const editSchema = formSchema.extend({
    id: z.number(),
})
