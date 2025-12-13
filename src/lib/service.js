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

export const updateRecipe = async (supabase, data) => {
    // update basic stuff 
    // we're passing in the whole form here, and currently db.updateRecipe takes care of
    // picking out the right stuff. This probably should be changed
    const { data: recipeData, error: recipeError } = await db.updateRecipe(supabase, data)

    // sections
    // ignore ingredients for now
    const sections = data.sections
        .map((s, i) => ({
            id: s.id,
            name: s.name,
            position: i + 1,
            recipe_id: data.id,
        }))

    const sectionIds = sections.map(s => s.id).filter(s => s) // no nulls

    // delete sections (cascades to assembly rows)
    // retains the sections that still are present on the form
    const { data: deletedSections } = await db.deleteSections(supabase, data.id, sectionIds)

    // update sections. Upsert since it allows a list as input
    const { data: updatedSections, error: updateSectionError } = await db.upsertSections(
        supabase,
        sections.filter(s => s.id) // no null ids, i.e. no new sections here
    )

    // add sections
    const { data: insertedSections, error: insertError } = await db.createSections(
        supabase,
        sections.filter(s => s.id === null).map(s => ({
            name: s.name,
            position: s.position,
            recipe_id: s.recipe_id,
        })) // only new sections, and ignore ids
    )

    const allSections = [...updatedSections, ...insertedSections]

    const ingredients = data.sections.map(s => s.ingredients).flat()

    // Get / Create ingredients
    const { data: allIngredients } = await db.getOrCreateIngredients(supabase, ingredients)

    // delete assembly rows
    const assemblyIds = ingredients.map(i => i.id).filter(i => i) // no nulls
    const { data: deletedAssemblies } = await db.deleteAssemblies(supabase, sectionIds, assemblyIds)

    // update assembly rows
    const assemblyRecords = data.sections.map(section => section.ingredients.map((assembly, index) => ({
        id: assembly.id,
        section_id: allSections.find(s => s.name === section.name).id,
        ingredient_id: allIngredients.find(i => i.name === assembly.name).id,
        position: index + 1,
        quantity: assembly.quantity,
        unit: assembly.unit,
        comment: assembly.comment,
        optional: assembly.optional,
    }))).flat()


    const assembliesToUpdate = assemblyRecords.filter(x => x.id)
    const assembliesToCreate = assemblyRecords.filter(x => !x.id).map(({ id, ...rest }) => rest) //drop null ids

    // offset trick for positions because unique index
    const BIG_NUMBER = 1000;
    // stupid, but works because realistically we'll never hit the offset number
    await db.upsertAssemblies(
        supabase,
        assembliesToUpdate.map(a => ({ ...a, position: a.position + BIG_NUMBER }))

    )

    // fix the positions
    const { data: updatedAssemblies, error: updatedAssemblyError } = await db.upsertAssemblies(supabase, assembliesToUpdate)

    const { data: createdAssemblies, error: createdAssemblyError } = await db.createAssemblies(
        supabase,
        assembliesToCreate.map(a => ({ ...a, position: a.position + BIG_NUMBER }))
    )

    // fix positions
    const { data: fixedAssemblies, error: fixedAssemblyError } = await db.upsertAssemblies(
        supabase,
        createdAssemblies.map(a => ({ ...a, position: a.position - BIG_NUMBER }))
    )
}

export const deleteRecipe = async (supabase, recipeId) => {
    const { data, error } = await db.deleteRecipe(supabase, recipeId)

    return { data, error }
}