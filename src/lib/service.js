/**
 * This module packages primitive db operations into more complex operations,
 * like creating the whole recipe.
 */

import * as db from '$lib/db'


export const createRecipe = async (supabase, data) => {
    // add recipe
    const { data: dbRecipe, error: recipeError } = await db.createRecipe(supabase, {
        name: data.name,
        tags: data.tags,
        source: data.source,
        method: data.method,
        notes: data.notes || null,
        yield_quantity: data.yield.quantity,
        yield_unit: data.yield.unit,
    })

    // add ingredients
    const { data: dbIngredients, error: ingredientError } = await db.getOrCreateIngredients(supabase, data.sections.map(s => s.ingredients).flat())


    // add sections
    const sections = data.sections.map((section, index) => ({
        name: section.name,
        position: index + 1,
        recipe_id: dbRecipe.id

    }))

    const { data: dbSections, error: sectionError } = await db.createSections(supabase, sections)

    // add assembly
    const assembly = data.sections.map(section => {

        const section_id = dbSections.find(s => s.name === section.name).id

        const rows = section.ingredients.map((ing, index) => {
            const ingredient_id = dbIngredients.find(i => i.name === ing.name).id

            return {
                section_id: section_id,
                ingredient_id: ingredient_id,
                position: index + 1,
                quantity: ing.quantity,
                unit: ing.unit,
                comment: ing.comment ?? null,
                optional: ing.optional ?? false,
            }
        })


        return rows
    }).flat()

    const { data: dbAssembly, error: assemblyError } = await db.createAssemblies(supabase, assembly)

    // could consider returing as a nested object, i,e, {...dbRecipe, section: dbSections.map(foo => bar)}
    return {
        data: {
            recipe: dbRecipe,
            ingredients: dbIngredients,
            sections: dbSections,
            assembly: dbAssembly,
        },
        error: {
            recipeError,
            ingredientError,
            sectionError,
            assemblyError,
        }
    }
}