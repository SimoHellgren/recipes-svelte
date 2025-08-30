import { superValidate } from "sveltekit-superforms";
import { formSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";

export const load = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
};


export const actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));


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
        const formIngredients = form.data.sections.map(s => s.ingredients).flat()

        // check which rows exist
        const { data: dbIngredients } = await supabase
            .from("ingredient")
            .select()
            .in("name", formIngredients.map(i => i.name))

        // create missing ingredients
        const ingredientsToCreate = formIngredients.filter(i => !dbIngredients.some(x => x.name === i.name))

        const { data: createdIngredients, error: ingredientError } = await supabase
            .from("ingredient")
            .insert(
                ingredientsToCreate.map(i => ({ name: i.name }))
            ).select()

        const allIngredients = [...dbIngredients, ...createdIngredients]


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

        return {
            form,
        };
    },
};