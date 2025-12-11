import { superValidate } from "sveltekit-superforms";
import { recipeSchema } from "$lib/components/recipe-form/schema";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";
import * as db from "$lib/db"; //probably not great to do low-level stuff here
import * as service from '$lib/service'

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

        // should probably parse the form data here somehow

        await service.updateRecipe(supabase, form.data)

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