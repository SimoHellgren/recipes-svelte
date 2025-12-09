import { superValidate } from "sveltekit-superforms";
import { recipeSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";
import * as db from "$lib/db";

export async function load({ params, locals: { supabase } }) {
    const { data } = await db.getRecipeById(supabase, params.id)

    const recipe = {
        id: data.id,
        name: data.name,
        tags: data.tags,
        source: data.source,
        yield: {
            quantity: data.yield_quantity,
            unit: data.yield_unit ?? "",

        },
        sections: data.section.map(s => ({
            ...s,
            ingredients: s.assembly.map(i => ({ ...i, name: i.ingredient.name }))
        })),
        method: data.method,
        notes: data.notes,

    }

    const form = await superValidate(recipe ?? {}, zod(recipeSchema))
    return {
        form
    };
};


export const actions = {
    update_recipe: async (event) => {
        const form = await superValidate(event, zod(recipeSchema));

        const { locals: { supabase } } = event;

        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // update basic stuff 
        // we're passing in the whole form here, and currently db.updateRecipe takes care of
        // picking out the right stuff. This probably should be changed
        const { data: recipeData, error: recipeError } = await db.updateRecipe(supabase, form.data)

        // sections
        // ignore ingredients for now
        const sections = form.data.sections
            .map((s, i) => ({
                id: s.id,
                name: s.name,
                position: i + 1,
                recipe_id: form.data.id,
            }))

        const sectionIds = sections.map(s => s.id).filter(s => s) // no nulls

        // delete sections (cascades to assembly rows)
        // retains the sections that still are present on the form
        const { data: deletedSections } = await db.deleteSections(supabase, form.data.id, sectionIds)

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

        const ingredients = form.data.sections.map(s => s.ingredients).flat()

        // Get / Create ingredients
        const { data: allIngredients } = await db.getOrCreateIngredients(supabase, ingredients)

        // delete assembly rows
        const assemblyIds = ingredients.map(i => i.id).filter(i => i) // no nulls
        const { data: deletedAssemblies } = await db.deleteAssemblies(supabase, sectionIds, assemblyIds)

        // update assembly rows
        const assemblyRecords = form.data.sections.map(section => section.ingredients.map((assembly, index) => ({
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

        throw redirect(303, `/recipes/${event.params.id}`)
    },

    delete_recipe: async (event) => {
        const { locals: { supabase } } = event;

        const recipeId = event.params.id

        // delete cascades to sections and assembly
        const { data, error } = await db.deleteRecipe(supabase, recipeId)

        throw redirect(303, "/")

    }
};