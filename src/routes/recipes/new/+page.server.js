import { superValidate } from "sveltekit-superforms";
import { recipeSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, redirect } from "@sveltejs/kit";
import { getOrCreateIngredients } from "$lib/db";

export const load = async ({ depends, locals: { supabase } }) => {
    return {
        form: await superValidate(zod(recipeSchema)),
    };
};


export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(recipeSchema));

        const { locals: { supabase } } = event;

        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        // add recipe
        const { data: recipe, error: recipeError } = await supabase.from("recipe").insert({
            name: form.data.name,
            tags: form.data.tags,
            source: form.data.source,
            method: form.data.method,
            notes: form.data.notes || null,
            yield_quantity: form.data.yield.quantity,
            yield_unit: form.data.yield.unit,
        }).select().single()

        // add ingredients
        const allIngredients = await getOrCreateIngredients(form.data.sections.map(s => s.ingredients).flat())

        // add sections
        const sectionsIn = form.data.sections.map((section, index) => ({
            name: section.name,
            position: index + 1,
            recipe_id: recipe.id

        }))
        const { data: sections, error: sectionError } = await supabase
            .from("section")
            .insert(sectionsIn)
            .select()


        // add assembly
        const assemblyIn = form.data.sections.map(section => {

            const section_id = sections.find(s => s.name === section.name).id

            const rows = section.ingredients.map((ing, index) => {
                const ingredient_id = allIngredients.find(i => i.name === ing.name).id

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

        const { data: assembly, error: assemblyError } = await supabase
            .from("assembly")
            .insert(assemblyIn)
            .select()

        throw redirect(303, `/recipes/${recipe.id}`)
    },
};